package com.oj.service.serviceImpl.resource;

import com.oj.mapper.resource.MyFileMapper;
import com.oj.service.resource.MyFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.List;
import java.util.Map;


/**
 * @author zt
 * @Time 2019年5月5日 11点47分
 * @Description 资源功能Service接口实现类
 */
@Service
public class MyFileServiceImpl implements MyFileService {

    @Autowired(required = false)
    private MyFileMapper myFileMapper;

    public List<Map>getFileListByFlag(Map<String, String> param)
    {
        System.out.println(param.toString());
        if(param.get("flag").equals("0"))
        {
            List<Map> list = myFileMapper.getTeacherFileByStudent(param);
            return list;
        }
        else
        {
            return myFileMapper.getOpenFile();
        }
    }

    public void downloadFile(String id, HttpServletResponse response)
    {
        String path = myFileMapper.getPathById(id);
        //System.out.println(path);
        String fileName = java.net.URLEncoder.encode(myFileMapper.getFileNameById(id));
        File file = new File(path);
        if (file.exists()) {
            //System.out.println("File path is : " + path);
            response.setHeader("content-type", "application/octet-stream");
            response.setHeader("Content-Disposition", "attachment;filename=" + fileName);
            //response.setHeader("Pragma", "No-cache");
            //response.setHeader("Cache-Control", "No-cache");
            //response.setDateHeader("Expires", 0);
            byte[] buff = new byte[1024];
            BufferedInputStream bis = null;
            FileInputStream fis = null;
            try {
                OutputStream os = response.getOutputStream();
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                int i = bis.read(buff);
                while (i != -1) {
                    os.write(buff, 0, buff.length);
                    //os.flush();
                    i = bis.read(buff);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (bis != null) {
                    try {
                        bis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if (fis != null) {
                    try {
                        fis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
    /**
     * 通过实验id与学生id获取提交状态信息
     * @return 全部考试实验
     */
    /*
    @Override
    public List<Map> getExperMaplist(String account) {
        return testMapper.getExperMaplist(account);
    }

    @Override
    public List<Map> getSubmitState(String sid,Map<String, String> param) {

        return testMapper.getSubmitState(param,sid);
    }

    @Override
    public List<Map> getTestDetail(String tid) {
        return testMapper.getTestDetail(tid);
    }

    //获取单个问题的详细信息
    public List<Map> getProblemDetails(String id){
        return testMapper.getProblemById(id);
    }

    //获取提交状态分类

    @Override
    public List<Map> getSubmitType() {
        return testMapper.getSubmitType();
    }*/
}
