package com.oj.service.serviceImpl.exam;

import static java.lang.System.out;
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
    @Override
    public Map getTargetProblemInf(String proId){
        Map result = mapper.getTargetProblemInf(proId);
        List proList = new LinkedList<String> ();
        proList.add(proId);
        List<Map> subList = mapper.getPagingPublicProblemStateList(proList);
        proList = new LinkedList<String> ();
        proList.add(proId);
        List<Map> AcList = mapper.getPagingPublicProblemACStateList(proList);
        result.put("proSubmitAmount", 0==subList.size()?"0":(subList.get(0)).get("proSubmitAmount").toString());
        result.put("proAcAmount", 0==AcList.size()?"0":(AcList.get(0)).get("proAcAmount").toString());
        return result;
    }



    //获取所有公开题目的统计信息（题目id、题目AC数量、题目提交数量）
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
    //获取对应指定用户的题目集------- 方案A（前端分页）
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






    //获取指定公开题目的统计信息（题目id、题目AC数量、题目提交数量）
    public List<Map> getPagingPublicProblemStatisticList(Map param){
        List<Map> result = new LinkedList<>();
        //out.println("分页的范围："+Integer.parseInt(param.get("headLine").toString())+", "+Integer.parseInt(param.get("finalLine").toString()) );
        List<Map> list = mapper.getPagingPublicProblemList(Integer.parseInt(param.get("headLine").toString()), Integer.parseInt(param.get("finalLine").toString())); //指定题目集
        //out.println("获取到的分页数据集:"+list.size());
        //out.println(list);
        out.println("指定题目集");
        out.println(list);
        List<Map<String, Object>> acList = mapper.getPagingPublicProblemACStateList(new LinkedList<>(list)); //指定题目集的所有AC提交统计
        List<Map<String, Object>> subList = mapper.getPagingPublicProblemStateList(new LinkedList<>(list)); //指定题目集的所有提交统计
        out.println("使用完指定题目集后，其内容变为:");
        out.println(list);
        out.println("指定题目集的所有AC提交统计");
        out.println(acList);
        out.println("指定题目集的所有提交统计");
        out.println(subList);
        list.forEach(cell -> {
            int i=0;
            String strProIdA = cell.get("proId").toString();

            for(;i<acList.size();i++) {
                Map temp = acList.get(i);
                if (strProIdA.equals(temp.get("proId").toString())){
                    cell.put("proAcNum", temp.get("proAcAmount").toString());
                    break;
                }
            }
            if(i==acList.size()) cell.put("proAcNum", "0");
            for(i=0;i<subList.size();i++){
                Map temp = subList.get(i);
                if(strProIdA.equals(temp.get("proId").toString())){
                    cell.put("proSubNum", temp.get("proSubmitAmount").toString());
                    break;
                }
            }
            if(i==subList.size()) cell.put("proSubNum", "0");
            result.add(cell);
        });
        return result;
    }
    //获取对应指定用户的题目集（题目id、题目AC数量、题目提交数量、指定用户的AC状态）------- 方案（数据库分页）
    public Map getPagingTargetProblemList(Map param){
        param.put("headLine", param.get("start"));
        param.put("finalLine", Integer.parseInt(param.get("limit").toString()));
        List<Map> result = new LinkedList<>();
        List<Map> targetList = getPagingPublicProblemStatisticList(param); //获取指定题集
        List<Map<String, Object>> targetProStateList = mapper.getPagingTargetProblemStateList(targetList, param.get("stuId").toString()); //获取指定用户在指定题集中已接触的集合
        targetList.forEach(cell ->{
            cell.put("AcState", "unknow");
            int tNum = (int)Math.ceil(0.05*(Double.parseDouble(cell.get("proRank").toString())) );
            tNum = (tNum==0?1:tNum);
            cell.put("proDifficulty", ""+ tNum);
            result.add(cell);
        } );
        targetProStateList.forEach(cell -> {
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
        Map temp = new HashMap();
        temp.put("draw", 0);
        temp.put("recordsTotal", result.size());  //当前获取到的数据总数
        temp.put("recordsFiltered", mapper.getAmountOfProblemList()); //实际数据总数
        temp.put("data", result);
        return temp;
    }

    //public Map getPaging

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


}
