package com.oj.controller.exam;


import com.oj.service.exam.PracticeService;
import com.oj.service.exam.TestService;
import org.mybatis.logging.Logger;
import org.mybatis.logging.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/practice")
public class Practice {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private PracticeService service;

    //返回练习页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "exam/practice";
    }

    //返回题目类型集
    @PostMapping("/getProblemTypeList")
    @ResponseBody
    public List<Map> getProblemTypeList(@RequestBody Map<String, String> param, HttpServletRequest request){
        return service.getProblemTypeList();
    }
    //返回所有的公开题目
    @PostMapping("/getProblemList")
    @ResponseBody
    public List<Map> getProblemList(@RequestBody Map<String, String> param, HttpServletRequest request){
        return service.getTargetProblemList(request.getSession().getAttribute("user_id").toString());
    }

    //返回指定用户在系统中的简要信息
    @PostMapping("/getSystemSimpleInf")
    @ResponseBody
    public Map getSystemSimpleInf(@RequestBody Map<String, String> param, HttpServletRequest request){
        return service.getSystemSimpleInf(request.getSession().getAttribute("user_id").toString());
    }

    //返回指定题目的详情页面
    @RequestMapping("/showProblemInf")
    public String showTestScore(@RequestParam("proId") String proId, @RequestParam("proAcPercentage") String proAcPercentage,@RequestParam("proAcNum") String proAcNum,@RequestParam("proSubNum") String proSubNum,Model model){
        Map<String,Object> info = new HashMap<>();
        info.put("proId", proId);
        info.put("proAcPercentage", proAcPercentage);
        info.put("proAcNum", proAcNum);
        info.put("proSubNum", proSubNum);
        model.addAttribute("info", info);
        return "exam/problemDetailsX";
    }

}