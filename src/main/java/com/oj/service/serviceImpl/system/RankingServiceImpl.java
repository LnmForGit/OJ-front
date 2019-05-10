package com.oj.service.serviceImpl.system;

import com.oj.entity.system.RankingList;
import com.oj.frameUtil.JqueryDataTableDto;
import com.oj.mapper.system.RankingMapper;
import com.oj.service.system.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by AC on 2019/5/7 13:50
 */
@Service
public class RankingServiceImpl implements RankingService {

    @Autowired(required = false)
    private RankingMapper mapper;
    @Override
    public JqueryDataTableDto getRankingMaplist(String start, String count) {
        Map<String, String> params = new HashMap<>();
        params.put("start", start);
        params.put("count", count);
        JqueryDataTableDto jqueryDataTableDto=new JqueryDataTableDto();
        List<RankingList> list = mapper.getRankingMaplist(params);
        int rank = Integer.valueOf(start)+1;
        for(int i=0;i<list.size();i++)
        {
            String id = list.get(i).getUser_id();
            int tot = mapper.selectTot(id);
            String Tot = String.valueOf(tot);
            String nname = mapper.selectName(id);
            list.get(i).setName(nname);
            list.get(i).setTot(Tot);
            list.get(i).setRank(rank);
            rank++;
        }
        int total = mapper.selectTotalCount();
        jqueryDataTableDto.setRecordsTotal(total);
        jqueryDataTableDto.setRecordsFiltered(total);
        jqueryDataTableDto.setData(list);
        return jqueryDataTableDto;
    }

    @Override
    public JqueryDataTableDto getRankingMaplist1(String start, String count) {
        long nowtime = Calendar.getInstance().getTimeInMillis()/1000;
        nowtime -= 7776000;
        String time = String.valueOf(nowtime);
        Map<String, String> params = new HashMap<>();
        params.put("start", start);
        params.put("count", count);
        JqueryDataTableDto jqueryDataTableDto=new JqueryDataTableDto();
        List<RankingList> list = mapper.getRankingMaplist1(params);
        int rank = Integer.valueOf(start)+1;
        for(int i=0;i<list.size();i++)
        {
            String id = list.get(i).getUser_id();
            int tot = mapper.selectTot1(id, time);
            String Tot = String.valueOf(tot);
            String nname = mapper.selectName(id);
            list.get(i).setName(nname);
            list.get(i).setTot(Tot);
            list.get(i).setRank(rank);
            rank++;
        }
        int total = mapper.selectTotalCount1(time);
        jqueryDataTableDto.setRecordsTotal(total);
        jqueryDataTableDto.setRecordsFiltered(total);
        jqueryDataTableDto.setData(list);
        return jqueryDataTableDto;
    }

    @Override
    public Map getStudent(String id) {
        Map<String, String> map = new HashMap<String, String>();
        int ac = mapper.selectAc(id);
        int tot = mapper.selectTot(id);
        double aclv = new Double(Math.round(ac*10000/tot)/100.0);//这样为保持4位;
        map.put("ac",String.valueOf(ac));
        map.put("tot",String.valueOf(tot));
        map.put("aclv",String.valueOf(aclv)+'%');
        String account = mapper.selectAccount(id);
        map.put("account",account);
        int rank = mapper.selectRank(ac)+1;
        map.put("rank",String.valueOf(rank));
        String Class = mapper.selectClass(id);
        map.put("class",Class);
        System.out.println(map);
        return map;
    }
}
