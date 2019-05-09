package com.oj.service.competition;
import java.util.List;
import java.util.Map;
public interface CompetitionService {
    ////返回全部竞赛信息
    public List<Map> getCompMaplist();
    //总数
    public int getCompSum();
    //返回一条即将要进行的比赛
    public List<Map> getACompMaplist();
}
