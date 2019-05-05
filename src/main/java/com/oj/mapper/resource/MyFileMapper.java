package com.oj.mapper.resource;


import com.oj.mapper.provider.resource.MyFileProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;
import java.util.Map;

/**
 * @author zt
 * @Time 2019年5月5日 11点47分
 * @Description myfile接口操作
 */
@Mapper
public interface MyFileMapper {


    //通过学生学号获取教他老师上传的文件
    /*
    @Select("select * from teach_myfile where flag = 0 and uploader_id = (" +
            "select admin_id from teach_admin_course where course_id in (" +
            "select course_id from teach_course_class where class_id in (" +
            "select class_id from teach_students where account = #{user_id})))")*/
    @SelectProvider(type = MyFileProvider.class, method = "getQuerySql")
    public List<Map> getTeacherFileByStudent(@Param("condition") Map<String, String> param);

    //获取所有公开文件
    @Select("select myfile.id as id, myfile.name as name, admin.name as uploader_name, myfile.upload_time as upload_time, myfile.size as size, myfile.flag as flag from teach_myfile myfile, teach_admin admin where flag = 1 and myfile.uploader_id = admin.id order by myfile.upload_time desc")
    public List<Map> getOpenFile();
/*
    //通过学号获取全部实验列表
    @Select("SELECT t.id id,name,start,end FROM teach_test t,teach_test_class c WHERE  c.`class_id` = #{account} AND c.`test_id` = t.id\n" +
            "and t.kind = 2 ORDER BY end DESC;")
    public List<Map> getExperMaplist(String account);

    //通过tid与学生id获取提交状态信息
    //通过TestProvider类中的getQuerySql()方法动态构建查询语句
    @SelectProvider(type= TestProvider.class, method = "getQuerySql")
    List<Map> getSubmitState(@Param("condition") Map<String, String> param, @Param("sid") String sid);

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
    List<Map> getProblemById(@Param("id") String id);

    //获取提交状态分类
    @Select("SELECT id,state_name from teach_submit_state")
    List<Map> getSubmitType();
*/
}
