package com.oj.controller.resource;

import com.oj.service.resource.MyFileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

/**
 * @author zt
 * @Time 2019年5月5日 11点44分
 * @Description 资源controller类
 */

@Controller
@RequestMapping("/resource")
public class MyFileController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private MyFileService myfileService;

    //返回文件列表页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "resource/myFile";
    }

    @RequestMapping("/getFileListByFlag")
    @ResponseBody
    public List<Map>getFileListByFlag(HttpServletRequest request, @RequestBody Map<String, String> param)
    {
        String user_id = request.getSession().getAttribute("user_account").toString();
        //System.out.println(user_id + " and " + request.getParameter("flag"));
        param.put("user_id", user_id);
        List<Map> list = myfileService.getFileListByFlag(param);
        return list;
    }

    @GetMapping("/downloadFile")
    @ResponseBody
    public void downloadFile(HttpServletRequest request, HttpServletResponse response)
    {
        String id = request.getParameter("id");
        //System.out.println("id : " + id);
        myfileService.downloadFile(id, response);
    }
    /*
    //返回实验列表页面
    @RequestMapping("/")
    public String index(ModelMap modelMap, HttpServletRequest request) {
        return "exam/exper";
    }

    //返回实验详情页面
    @RequestMapping("experDetail")
    public String experDetail(HttpServletRequest request) {
        return "exam/experDetail";
    }

    //返回题目详情页面
    @RequestMapping("/problemDetails")
    public String problemDetails( HttpServletRequest request) {
        return "exam/problemDetails";
    }

    //通过学生所在班级获取全部实验信息接口
    @PostMapping("/getAllExper")
    @ResponseBody
    public List<Map> getAllExper(HttpServletRequest request){
        String account = request.getSession().getAttribute("user_class").toString();
        return testService.getExperMaplist(account);
    }

    //通过实验id和学生学号获取实验成绩
    @PostMapping("/getSubmitState")
    @ResponseBody
    public List<Map> getSubmitState(@RequestBody Map<String, String> param, HttpServletRequest request){
        List<Map> list =  testService.getSubmitState(request.getSession().getAttribute("user_id").toString(),param);
        return list;
    }

    //获取一条实验或考试的详细信息
    @PostMapping("/getTestDetail")
    @ResponseBody
    public List<Map> getTestDetail(HttpServletRequest request){
        List<Map> list =  testService.getTestDetail(request.getParameter("tid"));
        return list;
    }

    @PostMapping("getProblemDetails")
    @ResponseBody
    public List<Map> getProblemDetails(HttpServletRequest request){
        List<Map> p = testService.getProblemDetails(request.getParameter("id"));
        return p;
    }

    //获取提交状态分类
    @PostMapping("getSubmitType")
    @ResponseBody
    public List<Map> getSubmitType(HttpServletRequest request){
        List<Map> p = testService.getSubmitType();
        return p;
    }*/

}