package kr.or.connect.reservation.dao;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import kr.or.connect.reservation.dao.sql.CommentImageDaoSql;
import kr.or.connect.reservation.dto.CommentImage;
import kr.or.connect.reservation.dto.FileInfo;

@Repository
public class CommentImageDao {
	private NamedParameterJdbcTemplate jdbc;
	private RowMapper<CommentImage> rowMapper = BeanPropertyRowMapper.newInstance(CommentImage.class);
	private SimpleJdbcInsert insertAction;
	
	public CommentImageDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public List<CommentImage> selectByDisplayInfoId(int displayInfoId, int commentId){
		Map<String, Integer> params = new HashMap<>();
		params.put("displayInfoId", displayInfoId);
		params.put("commentId", commentId);
		
		return jdbc.query(CommentImageDaoSql.SELECT_COMMENT_IMAGES,params,rowMapper);
	}
	
	public FileInfo selectFileInfo(int displayInfoId, int commentId) {
		FileInfo fileInfo;
		try {
			BeanPropertyRowMapper<FileInfo> fileInfoRowMapper = BeanPropertyRowMapper.newInstance(FileInfo.class);
			
			Map<String,Object> params = new HashMap<>();
			params.put("displayInfoId", displayInfoId);
			params.put("commentId", commentId);
			
			fileInfo = jdbc.queryForObject(CommentImageDaoSql.SELECT_FILE_INFO, params, fileInfoRowMapper);
		}catch (EmptyResultDataAccessException e) {
			fileInfo = null;
		}catch (Exception e) {
			e.printStackTrace();
			fileInfo = null;
			
		}
		
		return fileInfo;
	}
}
