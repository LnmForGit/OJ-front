package com.oj.service.serviceImpl.exam;

import com.oj.configuration.ThreadPoolConfig;
import com.oj.judge.DispatchTask;
import com.oj.service.exam.AsyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Scope("prototype")
public class AsyncServiceImpl implements AsyncService {
    @Autowired
    private ThreadPoolConfig threadPoolConfig;
    @Autowired
    private DispatchTask task;
    @Override
    public void judgeSubmit(String subId, Map<String, String> subInfo) {
        //DispatchTask task = new DispatchTask();
        task.setSubId(subId);
        task.setMap(subInfo);
        threadPoolConfig.taskExecutor().execute(task);
    }
}
