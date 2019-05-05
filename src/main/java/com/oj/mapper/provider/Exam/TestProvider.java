package com.oj.mapper.provider.Exam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Map;

/**
 * @author zhouli
 * @Description 与Test表相关动态sql生成
 */
public class TestProvider  {
    private Logger log = LoggerFactory.getLogger(this.getClass());
    public String getQuerySql(Map<String, Object> params){
        Map<String, String> info = (Map<String, String>)params.get("condition");
        String sid = (String)params.get("sid");
        String tid = info.get("tid");
        StringBuffer sql = new StringBuffer();
        sql.append(" SELECT ( @i := @i + 1 ) AS num,t1.* ");
        sql.append(" FROM( SELECT problems.id id,name,score,submit_code,submit_date,l.language_name submit_language,ss.state_name submit_state,submit_memory,submit_time,submit_code_length");

        sql.append(" FROM (SELECT p.id id,p.name name,tp.score score FROM teach_problems p,");
        sql.append(" (SELECT pid,score FROM teach_test_problems WHERE tid = "+ tid+") AS tp");
        sql.append(" WHERE p.id = tp.pid");
        if (!StringUtils.isEmpty(info.get("id"))){
            sql.append(" AND p.id = '"+info.get("id")+"' ");
        }
        if (!StringUtils.isEmpty(info.get("name"))){
            sql.append(" AND p.name like '%"+info.get("name")+"%' ");
        }
        sql.append(" )AS problems");
        sql.append(" LEFT JOIN teach_submit_code tc");
        sql.append(" ON tc.problem_id = problems.id AND test_id = "+tid+" AND tc.`user_id` = " + sid);
        sql.append(" LEFT JOIN teach_submit_language l ON l.id = submit_language");
        sql.append(" LEFT JOIN teach_submit_state ss ON ss.id = submit_state");

        if (!StringUtils.isEmpty(info.get("submit"))){
            sql.append(" AND ss.id = "+info.get("submit"));
        }
        sql.append(" order by submit_date desc");

        sql.append(" ) t1,( SELECT @i := 0 ) t2 ");
        log.info(sql.toString());
        return sql.toString();
    }
}
