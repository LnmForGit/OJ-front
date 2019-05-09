package com.oj.controller.competition;
import com.oj.service.competition.CompetitionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/competition")
public class CompetitionController {
    private Logger log = LoggerFactory.getLogger(this.getClass());


    @Autowired
    private CompetitionService competitionService;
    //返回主题管理页面
    @RequestMapping("/")
    public String index() {
        return "competition/competition";
    }

    //返回全部竞赛信息
    @PostMapping("/getComp")
    @ResponseBody
    public Map<String, Object> getCompMaplist() {
        List<Map> list = competitionService.getCompMaplist();
        Map<String,Object> topic=new  HashMap<>();
        topic.put("list",list);
        topic.put("sum",competitionService.getCompSum());
        return topic;
    }
    //返回未开始的一条竞赛信息
    @PostMapping("/getAComp")
    @ResponseBody
    public List<Map> getAComplist() {
        List<Map> list = competitionService.getACompMaplist();


        return list;
    }

    //排名信息


}
