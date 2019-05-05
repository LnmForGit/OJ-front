package com.oj.controller.system;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/index")
public class IndexController {
    @RequestMapping("/")
    //返回index.html页面
    public String index(HttpServletRequest request) {
        return "index";
    }
    @RequestMapping("/pageNotFound")
    //返回index.html页面
    public String pageNotFound(HttpServletRequest request) {
        return "error/404";
    }
}
