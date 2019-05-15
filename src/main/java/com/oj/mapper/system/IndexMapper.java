package com.oj.mapper.system;

import com.oj.entity.system.Auth;
import org.apache.ibatis.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

/**
 * @author lixu
 * @Time 2019年5月13日 14点54分
 * @Description 首页相关业务数据库操作接口类
 */
@Mapper
public interface IndexMapper {
    //获取通知信息
    @Select("SELECT id,title, CAST(FROM_UNIXTIME(time) as char) time,author FROM teach_notice ORDER BY time desc LIMIT 0,5")
    public List<Map> getJxtzList();

    //通过ID获取通知信息
    @Select("SELECT id,title, CAST(FROM_UNIXTIME(time) as char) time,author,content FROM teach_notice where id=#{id}")
    public Map getJxtzById(String id);

    @Select("SELECT a.id, name, CAST(FROM_UNIXTIME(a.start) as char) start, CAST(FROM_UNIXTIME(a.end) as char) end " +
            "FROM teach_test a INNER JOIN (SELECT * FROM teach_test_class WHERE class_id = #{classId}) b on a.id = b.test_id " +
            "where a.end > UNIX_TIMESTAMP(SYSDATE())")
    public List<Map> getReToDo(String classId);

    @Select("SELECT * from teach_recommand_result where uid = #{user_id} ORDER BY score DESC")
    public List<Map> getRecommandList(@Param("user_id")String user_id);

}
