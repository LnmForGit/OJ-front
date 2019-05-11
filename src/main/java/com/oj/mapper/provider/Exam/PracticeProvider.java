package com.oj.mapper.provider.Exam;

import static java.lang.System.out;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

public class PracticeProvider {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    //获取指定条件的题目集的总数
    public String getAmountPublicProblemListSQL(Map<String, Object> params){
        StringBuffer sql = new StringBuffer();
        Map<String, Object> info = (Map<String, Object>)params.get("condition");
        sql.append("select count(*) from teach_problems t where t.public='on' ");
        if(!StringUtils.isEmpty(info.get("idOrNameDataArg").toString())){
            sql.append(" and ( t.id like '%"); sql.append(info.get("idOrNameDataArg"));
            sql.append("%') ");
            //sql.append("%' or t.name like '%"); sql.append(info.get("idOrNameDataArg")); sql.append("%' ) ");
        }else if(!StringUtils.isEmpty(info.get("problemTypeArg").toString())  && !info.get("problemTypeArg").toString().equals("-1")){
            sql.append(" and t.subjectid = "); sql.append(info.get("problemTypeArg").toString());
        }
        log.info(sql.toString());
        return sql.toString();
    }
    //分页---获取符合指定条件的题目集
    public String getPagingPublicProblemListSQL(Map<String, Object> params){
        StringBuffer sql = new StringBuffer();
        Map<String, Object> info = (Map<String, Object>)params.get("condition");
        //out.println("题目集的条件");
        //out.println(info);
        sql.append("select t.id proId, t.name proName, t.rank proRank, t.subjectid proTypeId from teach_problems t where t.public = 'on' ");
        if(!StringUtils.isEmpty(info.get("idOrNameDataArg").toString())){
            sql.append(" and t.id = "); sql.append(info.get("idOrNameDataArg"));
            //sql.append(" and ( t.id like '%"); sql.append(info.get("idOrNameDataArg"));
            //sql.append("%') ");
            //sql.append("%' or t.name like '%"); sql.append(info.get("idOrNameDataArg")); sql.append("%' ) ");
        }else if(!StringUtils.isEmpty(info.get("problemTypeArg").toString())  && !info.get("problemTypeArg").toString().equals("-1")){
            sql.append(" and t.subjectid = "); sql.append(info.get("problemTypeArg").toString());
        }
        if(!StringUtils.isEmpty(info.get("difficultySortTypeArg").toString())){
            if(info.get("difficultySortTypeArg").toString().equals("1"))
                sql.append(" order by t.rank desc, t.id ");
            else sql.append(" order by t.rank , t.id ");
        }
        sql.append(" limit "); sql.append(info.get("headLine")+", "+info.get("finalLine"));
        //order by proId limit #{firstLine}, #{finalLine}")

        log.info(sql.toString());
        return sql.toString();
    }

    //分页---获取指定题集的所有提交记录数据（题目id、题目提交总数）
    public String getPagingPublicProblemStateListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select t.problem_id proId, count(t.problem_id) proSubmitAmount from teach_submit_code t where t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0).get("proId").toString()); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell.get("proId").toString());
        });
        sql.append(") group by t.problem_id ");

        log.info(sql.toString());
        return sql.toString();
    }
    //分页---获取指定题集的已AC的提交数据（题目id、题目Ac次数）
    public String getPagingPublicProblemACStateListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select t.problem_id proId, count(t.problem_id) proAcAmount from teach_submit_code t where t.accuracy=1 and t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0).get("proId").toString()); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell.get("proId").toString());
        });
        sql.append(") group by t.problem_id ");

        log.info(sql.toString());
        return sql.toString();
    }
    //分页---在指定题目集中，获取指定用户已尝试的题目集（已解决和未解决的都有/未包含实验与考试的记录）
    public String getPagingTargetProblemStateListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select distinct t.problem_id proId, max(t.accuracy) accuracy from teach_submit_code t  where t.user_id = ");
        sql.append((String)params.get("stuId").toString());
        sql.append(" and t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0).get("proId").toString()); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell.get("proId").toString());
        });
        sql.append(") group by proId order by proId, accuracy desc ");

        log.info(sql.toString());
        return sql.toString();
    }
    //分页---在指定题目集中，获取指定用户已解决的题目集（只含已解决的/未包含实验与考试的记录）
    public String getPagingFinishProblemListSQL(Map<String, Object> params){
        List<Map> info = (List<Map>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select distinct t.problem_id proId, max(t.accuracy) accuracy from teach_submit_code t  where t.accuracy = 1 and t.user_id = ");
        sql.append((String)params.get("stuId").toString());
        sql.append(" and t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0).get("proId").toString()); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell.get("proId").toString());
        });
        sql.append(") group by proId order by proId, accuracy desc ");

        log.info(sql.toString());
        return sql.toString();
    }



}
