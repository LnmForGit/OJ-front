package com.oj.controller.system;

import com.oj.service.system.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/index")
public class IndexController {
    @Autowired
    private IndexService indexService;

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

    @PostMapping("/getJxtzList")
    @ResponseBody
    public List<Map> getJxtzList(){
        return indexService.getJxtzList();
    }

    @PostMapping("/getJxtzById")
    @ResponseBody
    public Map getJxtzById(HttpServletRequest request){
        String id = request.getParameter("id").toString();
        return indexService.getJxtzById(id);
    }

    @PostMapping("/getReToDo")
    @ResponseBody
    public List<Map> getReToDo(HttpServletRequest request){
         return indexService.getReToDo(request.getSession().getAttribute("user_class").toString());
    }

    @PostMapping("/getRecommandList")
    @ResponseBody
    public List<Map> getRecommandList(HttpServletRequest request){
         return indexService.getRecommandList(request.getSession().getAttribute("user_id").toString());
    }
}
