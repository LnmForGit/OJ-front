package com.oj.controller.exam;

import static java.lang.System.out;

import com.oj.entity.practic.SubmitCode;
import com.oj.service.exam.AsyncService;
import com.oj.service.exam.PracticeService;
import org.apache.commons.lang.StringUtils;
import org.mybatis.logging.Logger;
import org.mybatis.logging.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/practice")
public class Practice {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private PracticeService service;
    static int tempInt = 1;
    @Autowired
    private AsyncService asyncService;
    //返回练习页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "exam/practiceL";
    }

    //返回题目类型集
    @PostMapping("/getProblemTypeList")
    @ResponseBody
    public List<Map> getProblemTypeList(@RequestBody Map<String, String> param, HttpServletRequest request){
        return service.getProblemTypeList();
    }
    //返回所有的公开题目-- 未分页
    @PostMapping("/getProblemList")
    @ResponseBody
    public List<Map> getProblemList(@RequestBody Map<String, String> param, HttpServletRequest request){
        return service.getTargetProblemList(request.getSession().getAttribute("user_id").toString());
    }

    //返回所有的公开题目-- 数据库分页
    @PostMapping("/getPagingProblemList")
    @ResponseBody
    public Map getPagingProblemList(@RequestBody Map<String, String> param, HttpServletRequest request){
        out.println(param);
        param.put("stuId", request.getSession().getAttribute("user_id").toString());
        Map result = service.getPagingTargetProblemList(param);
        //return result;
        return result;
    }

    //返回指定用户在系统中的简要信息
    @PostMapping("/getSystemSimpleInf")
    @ResponseBody
    public Map getSystemSimpleInf(@RequestBody Map<String, String> param, HttpServletRequest request){
        return service.getSystemSimpleInf(request.getSession().getAttribute("user_id").toString());
    }

    //返回指定题目的详情页面
    @RequestMapping("/showProblemInf")
    public String showTestScore(@RequestParam("proId") String proId,@RequestParam("testId") String testId, Model model){
        Map<String,Object> info = service.getTargetProblemInf(proId);//new HashMap<>();
        info.put("proId", proId);
        info.put("testId", testId);
        model.addAttribute("info", info);
        return "exam/problemDetailsL";
    }

    //接收用户提交代码
    @PostMapping("/receiveCode")
    @ResponseBody
    public Map receiveCode(@RequestBody Map<String, String> param, HttpServletRequest request){
         Map<String, String> result = new HashMap<>();
         SubmitCode code = new SubmitCode();
         code.setHide(StringUtils.isEmpty(param.get("hide")) ? 0 : 1);
         code.setProblemId(Integer.valueOf(param.get("proId")));
         String codeData = param.get("codeData");
         code.setSubmitCode(codeData);
         code.setSubmitCodeLength(codeData.getBytes().length);
         code.setSubmitLanguage(Integer.valueOf(param.get("language")));
         code.setTestId(StringUtils.isEmpty(param.get("testId")) ? 0 : Integer.valueOf(param.get("testId")));
         code.setSubmitDate(System.currentTimeMillis()/1000);
         code.setUserId((Integer) request.getSession().getAttribute("user_id"));
         service.insertSubmit(code);
         Map<String, String> subInfo = new HashMap<>();
         subInfo.put("problem_id:", param.get("proId"));
         subInfo.put("submit_code:", codeData);
         subInfo.put("submit_language:", param.get("language"));
         //异步任务
         asyncService.judgeSubmit(String.valueOf(code.getId()), subInfo);
         /*Jedis jedis = redisPoolFactory.getResource();
         jedis.rpush("sub_id:", String.valueOf(code.getId()));
         Map<String, String> subInfo = new HashMap<>();
         subInfo.put("problem_id:", param.get("proId"));
         subInfo.put("submit_code:", codeData);
         subInfo.put("submit_language:", param.get("language"));
         jedis.hmset("sub_id:"+code.getId(), subInfo);
         jedis.close();*/

         return result;
    }
    //获取指定提交号的处理结果
    @PostMapping("/getTheSubmitResult")
    @ResponseBody
    public Map getTheSubmitResult(@RequestBody Map<String, String> param, HttpServletRequest request){
        Map result = new HashMap<String, String>();
        out.println(param);
        result.put("result", "wrongAnswer");
        result.put("inf", "部分正确(60%)");
        return result;
    }

}
