package com.oj.mapper.exam;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface PracticeMapper {

    //获取题目类型集
    @Select("select t.id, t.name, t.description father from teach_subject t order by t.id")
    public List<Map<String, Object>> getProblemTypeList();

    //获取公开题目集
    @Select("select t.id proId, t.name proName, t.rank proAcPercentage, t.subjectid proTypeId from teach_problems t where t.public = 'on'")
    public List<Map<String, Object>> getProblemList();

    //获取指定用户已尝试的题目集（已解决和未解决的都有/未包含实验与考试的记录）
    @Select("select distinct t.problem_id proId, max(t.accuracy) accuracy from teach_submit_code t  where t.user_id = #{stuId} and t.`problem_id` in (select t.id proId from teach_problems t where t.public = 'on') group by proId order by proId, accuracy desc ")
    public List<Map<String, Object>> getTargetProblemStateList(String stuId);

    //获取指定用户已解决的题目集（只含已解决的/未包含实验与考试的记录）
    @Select("select t.problem_id proId from teach_submit_code t where t.user_id = #{stuId} and t.accuracy=1 and t.problem_id in (select id proId from teach_problems where public = 'on') group by t.problem_id")
    public List<Object> getFinishProblemList(String stuId);

    //获取指定用户的系统排名（依据为已解决题的数量）   !!!!不推举，时长过久
    @Select("select count(t.userId) from (select id userId from teach_students) t where (select count(distinct problem_id) FinishAmount from teach_submit_code where user_id=t.userId and accuracy=1 and problem_id in (select t.id proId from teach_problems t where t.public = 'on') ) > (select count(distinct problem_id) FinishAmount from teach_submit_code where user_id=#{stuId} and accuracy=1 and problem_id in (select t.id proId from teach_problems t where t.public = 'on') )")
    public Object getTargetRank(String stuId);

    //
}
