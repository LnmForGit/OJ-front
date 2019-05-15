package com.oj.service.serviceImpl.system;

import com.oj.entity.system.SubmitCodeList;
import com.oj.frameUtil.JqueryDataTableDto;
import com.oj.mapper.system.SubmitStatusMapper;
import com.oj.service.system.SubmitStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by AC on 2019/5/6 15:54
 */
@Service
public class SubmitStatusServicelmpl implements SubmitStatusService {
    @Autowired(required = false)
    private SubmitStatusMapper mapper;

    @Override
    public JqueryDataTableDto getSubmitStatusMaplist(String start, String count, String problem_id, String account, String submit_state, String user_id)  {
        Map<String, String> params = new HashMap<>();
        params.put("start", start);
        params.put("count", count);
        params.put("problem_id", problem_id);
        params.put("user_id", user_id);
        params.put("submit_state", submit_state);
        JqueryDataTableDto jqueryDataTableDto=new JqueryDataTableDto();
        List<SubmitCodeList> list = mapper.getSubmitStatusMaplist(params);
        int total = mapper.selectTotalCount(user_id);
        jqueryDataTableDto.setRecordsTotal(total);
        jqueryDataTableDto.setRecordsFiltered(total);
        jqueryDataTableDto.setData(list);
        return jqueryDataTableDto;
    }
}
