package com.oj.controller.exam;

import com.oj.service.exam.TestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * @author zhouli
 * @Time 2019年5月4日 15点48分
 * @Description
 */

@Controller
@RequestMapping("/exam")
public class ExamController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private TestService testService;

    //返回考试列表页面
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
}
