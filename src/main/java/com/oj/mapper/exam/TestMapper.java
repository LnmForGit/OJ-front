package com.oj.mapper.exam;


import com.oj.mapper.provider.Exam.TestProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;
import java.util.Map;

/**
 * @author zhouli
 * @Time 2019年4月30日 17点58分
 * @Description teach_test操作接口
 */
@Mapper
public interface TestMapper {

    //通过学号获取全部实验列表
    @Select("SELECT t.id id,name,start,end FROM teach_test t,teach_test_class c WHERE  c.`class_id` = #{account} AND c.`test_id` = t.id\n" +
            "and t.kind = 2 ORDER BY end DESC;")
    public List<Map> getExperMaplist(String account);

    //通过tid与学生id获取提交状态信息
    //通过TestProvider类中的getQuerySql()方法动态构建查询语句
    @SelectProvider(type= TestProvider.class, method = "getQuerySql")
    List<Map> getSubmitState(@Param("condition")Map<String, String> param,@Param("sid")String sid);

    //获取一条实验或考试的详细信息
    @Select("SELECT t.name name,start,end,description,a.name admin " +
            "FROM teach_test t,teach_admin a " +
            "WHERE t.`id` = #{tid} AND t.admin_id = a.`id`;")
    public List<Map> getTestDetail(String tid);

    //通过id获取题目详细信息
    @Select("SELECT  p.*,COUNT(sc.submit_state = 1 OR NULL) AC_number,COUNT(sc.id) submit_number,s.name subject\n" +
            "FROM teach_problems p LEFT JOIN teach_subject s ON s.id = p.`subjectid`\n" +
            "left join teach_submit_code sc on  p.id = sc.`problem_id`  WHERE p.id =  #{id}\n" +
            "GROUP BY p.id")
    List<Map> getProblemById(@Param("id")String id);

    //获取提交状态分类
    @Select("SELECT id,state_name from teach_submit_state")
    List<Map> getSubmitType();

}
