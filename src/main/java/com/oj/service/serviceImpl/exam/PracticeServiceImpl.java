package com.oj.service.serviceImpl.exam;

import com.oj.entity.practic.SubmitCode;
import com.oj.entity.practic.TestData;
import com.oj.judge.RedisUtils;
import com.oj.mapper.exam.PracticeMapper;
import com.oj.service.exam.PracticeService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class PracticeServiceImpl implements PracticeService {

    @Autowired(required = false)
    private PracticeMapper mapper;


    @Autowired
    private RedisUtils redisUtils;
    //获取题目类型的二级列表数据
    @Override
    public List<Map> getProblemTypeList(){
        List<Map> result = new LinkedList<Map>();
        List<Map> temp;
        Map cell;
        List<Map<String, Object>> list = mapper.getProblemTypeList();
        cell = new HashMap<>();
        cell.put("typeAName", "全部"); cell.put("typeBList", "[]");
        result.add(cell);

        int i=0, j;
        String strA, strB;
        for(;i<list.size();i++){
            if(null == list.get(i).get("father") || list.get(i).get("father").toString().equals("")){
                temp = new LinkedList<Map>();
                strA = list.get(i).get("id").toString();
                for(j=i+1; j<list.size();j++){
                    if(null == list.get(j).get("father")) continue;
                    strB=list.get(j).get("father").toString();
                    if(strB.equals(strA)){
                        cell = new HashMap<String, String>();
                        cell.put("typeBName", list.get(j).get("name").toString());
                        cell.put("typeBId", list.get(j).get("id").toString());
                        temp.add(cell);
                    }
                }
                cell = new HashMap<>();
                cell.put("typeAName", list.get(i).get("name").toString());
                cell.put("typeBList", temp);
                result.add(cell);
                //out.println(result);
            }
        }
        return result;
    }
    //获取公开题目的统计信息（题目id、题目AC数量、题目提交数量）
    public List<Map> getPublicProblemStatisticList(){
        List<Map> result = new LinkedList<>();
        List<Map<String, Object>> list = mapper.getPublicProblemList(); //公开题目集
        List<Map<String, Object>> acList = mapper.getPublicProblemACStateList(); //公开题目集的所有AC提交统计
        List<Map<String, Object>> subList = mapper.getPublicProblemStateList(); //公开题目集的所有提交统计
        list.forEach(cell -> {
            int i=0;
            String strProIdA = cell.get("proId").toString();
            for(;i<acList.size();i++) {
                Map temp = acList.get(i);
                if (strProIdA.equals(temp.get("proId").toString())){
                        cell.put("proAcNum", temp.get("AcAmount").toString());
                        break;
                }
            }
            if(i==acList.size()) cell.put("proAcNum", "0");
            for(i=0;i<subList.size();i++){
                Map temp = subList.get(i);
                if(strProIdA.equals(temp.get("proId").toString())){
                    cell.put("proSubNum", temp.get("submitAmount").toString());
                    break;
                }
            }
            if(i==subList.size()) cell.put("proSubNum", "0");
            result.add(cell);
        });

        return result;
    }
    //获取对应指定用户的题目集
    @Override
    public List<Map> getTargetProblemList(String stuId){
        //out.println("##"+stuId);
        List<Map> result = new LinkedList<>();
        List<Map> AllProList = getPublicProblemStatisticList(); //获取公开的题目集
        List<Map<String, Object>> TargetProStateList = mapper.getTargetProblemStateList(stuId); //获取指定用户已接触的题目集(这里面包含了，实验与考试时的提交记录)!!!可优化
        AllProList.forEach(cell ->{
            cell.put("AcState", "unknow");
            int tNum = (int)Math.ceil(0.05*(Double.parseDouble(cell.get("proRank").toString())) );
            tNum = (tNum==0?1:tNum);
            cell.put("proDifficulty", ""+ tNum);
            result.add(cell);
        } );
        TargetProStateList.forEach(cell -> {
            String str = cell.get("proId").toString();
            int i=0; Map temp;
            for(;i<result.size();i++){
                temp = result.get(i);
                if(str.equals(temp.get("proId").toString())) {
                    temp.put("AcState", Double.parseDouble(cell.get("accuracy").toString())==1.0 ? "true" : "false");
                    break;
                }
            }
        });
        return result;
    }
    @Override
    //获取指定用户在系统中的简要信息
    public Map getSystemSimpleInf(String stuId){
        Map<String, String> result = new HashMap<>();
        List finishList = mapper.getFinishProblemList(stuId);
        List targetList = mapper.getTargetProblemStateList(stuId);
        List AllProblemlist = mapper.getPublicProblemList();
        result.put("problemAmount", ""+AllProblemlist.size());
        result.put("tryProblemAmount", ""+targetList.size());
        result.put("finishProblemAmount", ""+finishList.size());
        result.put("systemRank", ""+(AllProblemlist.size()-finishList.size()) );
        return result;
    }
    //获取指定题目的详细信息
    public Map getTargetProblemInf(String proId){
        return mapper.getTargetProblemInf(proId);
    }

    @Override
    public Integer insertSubmit(SubmitCode code) {
        return mapper.insertSubmit(code);
    }

    @Override
    public Integer updateState(SubmitCode pojo) {
        return mapper.updateState(pojo);
    }

    @Override
    public Map<Integer, List<String>> selectTestData(Integer problemId) {
        Map<Integer, List<String>> res = redisUtils.getTestData(problemId);
        if (res != null && res.size() > 0) {
            return res;
        }
        List<TestData> list = mapper.selectTestData(problemId);
        //如果list为空，则该题目无测试样例，需写log
        if (list == null || list.size() == 0) {
            //写log
            Log log = LogFactory.getLog(PracticeServiceImpl.class);
            log.error("ProblemId:" + problemId + "has no testData!");
        } else {
            res = redisUtils.writeToRedisAndGetTestData(list, problemId);
        }
        return res;
    }

    //将用户提交代码存入数据库
    public void saveSubmitCode(){

    }
}
