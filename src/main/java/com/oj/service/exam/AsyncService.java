package com.oj.service.exam;

import java.util.Map;

public interface AsyncService {
    void judgeSubmit(String subId, Map<String, String> subInfo);
}
