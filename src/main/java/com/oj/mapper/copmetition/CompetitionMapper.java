package com.oj.mapper.copmetition;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;
@Mapper
public interface CompetitionMapper {
    //竞赛信息列表
    @Select("SELECT  id,name,FROM_UNIXTIME(start),FROM_UNIXTIME(end),description from teach_test where kind=4 and end<now()")
    public List<Map> getCompMaplist();
    //总数
    @Select("SELECT count(*) from teach_test where kind=4 and end<unix_timestamp(now())")
    public int getSum();
    //
    @Select("select id,name,FROM_UNIXTIME(start),FROM_UNIXTIME(end),description\n" +
            "from teach_test where kind=4 and end>unix_timestamp(now()) order by start limit 1")
    public List<Map> getACompList();
}
