package com.oj.service.serviceImpl.competition;
import com.oj.mapper.copmetition.CompetitionMapper;
import com.oj.service.competition.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
@Service
public class CompetitionServicelmpl implements CompetitionService{

    @Autowired(required = false)
    private CompetitionMapper mapper;
    //获取竞赛列表
    @Override
    public List<Map> getCompMaplist(){
        return mapper.getCompMaplist();
    }
    //总数
    public int getCompSum(){
        return mapper.getSum();
    }
    //返回一条即将要进行的比赛
    public List<Map> getACompMaplist(){
        return mapper.getACompList();
    }
}
