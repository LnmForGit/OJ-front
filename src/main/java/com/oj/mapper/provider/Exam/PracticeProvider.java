package com.oj.mapper.provider.Exam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

public class PracticeProvider {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    //分页---获取指定题集的所有提交记录数据（题目id、题目提交总数）
    public String getPagingPublicProblemStateListSQL(Map<String, Object> params){
        List info = (List<String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select t.problem_id proId, count(t.problem_id) proSubmitAmount from teach_submit_code t where t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0).toString()); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell.toString());
        });
        sql.append(") group by t.problem_id ");

        log.info(sql.toString());
        return sql.toString();
    }
    //分页---获取指定题集的已AC的提交数据（题目id、题目Ac次数）
    public String getPagingPublicProblemACStateListSQL(Map<String, Object> params){
        List info = (List<String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select t.problem_id proId, count(t.problem_id) proAcAmount from teach_submit_code t where t.accuracy=1 and t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0).toString()); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell.toString());
        });
        sql.append(") group by t.problem_id ");

        log.info(sql.toString());
        return sql.toString();
    }
    //分页---在指定题目集中，获取指定用户已尝试的题目集（已解决和未解决的都有/未包含实验与考试的记录）
    public String getPagingTargetProblemStateListSQL(Map<String, Object> params){
        List info = (List<String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select distinct t.problem_id proId, max(t.accuracy) accuracy from teach_submit_code t  where t.user_id = ");
        sql.append((String)params.get("stuId").toString());
        sql.append(" and t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0)); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell);
        });
        sql.append(") group by proId order by proId, accuracy desc ");

        log.info(sql.toString());
        return sql.toString();
    }
    //分页---在指定题目集中，获取指定用户已解决的题目集（只含已解决的/未包含实验与考试的记录）
    public String getPagingFinishProblemListSQL(Map<String, Object> params){
        List info = (List<String>)params.get("condition");
        StringBuffer sql = new StringBuffer();
        sql.append("select distinct t.problem_id proId, max(t.accuracy) accuracy from teach_submit_code t  where t.accuracy = 1 and t.user_id = ");
        sql.append((String)params.get("stuId").toString());
        sql.append(" and t.problem_id in (");
        if(info.size()>0){
            sql.append(info.get(0)); info.remove(0);
        }
        info.forEach(cell->{
            sql.append(", "+cell);
        });
        sql.append(") group by proId order by proId, accuracy desc ");

        log.info(sql.toString());
        return sql.toString();
    }



}
