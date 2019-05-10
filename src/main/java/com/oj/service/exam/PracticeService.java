package com.oj.service.exam;

import com.oj.entity.practic.SubmitCode;

import java.util.List;
import java.util.Map;

public interface PracticeService {

    //获取题目类型的二级列表数据
    public List<Map> getProblemTypeList();
    //获取对应指定用户的题目集
    public List<Map> getTargetProblemList(String stuId);
    //获取指定用户在系统中的简要信息
    public Map getSystemSimpleInf(String stuId);
    //获取指定题目的详细信息
    public Map getTargetProblemInf(String proId);

    /**
     * 插入一行提交信息
     * @param code
     * @return
     */
    Integer insertSubmit(SubmitCode code);

    /**
     * 更新状态
     * @param pojo
     * @return
     */
    Integer updateState(SubmitCode pojo);
    /**
     * 得到测试样例
     * @param problemId
     * @return
     */
    Map<Integer, List<String>> selectTestData(Integer problemId);
}
