package kr.or.connect.reservation.dao;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import kr.or.connect.reservation.dao.sql.DisplayInfoImageDaoSql;
import kr.or.connect.reservation.dto.DisplayInfoImage;
import kr.or.connect.reservation.dto.FileInfo;

@Repository
public class DisplayInfoImageDao {
	private NamedParameterJdbcTemplate jdbc;
	private RowMapper<DisplayInfoImage> rowMapper = BeanPropertyRowMapper.newInstance(DisplayInfoImage.class);
	private SimpleJdbcInsert insertAction;
	
	public DisplayInfoImageDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public DisplayInfoImage selectByDisplayInfoId(int displayInfoId) {
		DisplayInfoImage displayInfoImage;
		
		try {
			displayInfoImage = (DisplayInfoImage) jdbc.queryForObject(DisplayInfoImageDaoSql.SELECT_BY_DISPLAY_INFO_ID, Collections.singletonMap("displayInfoId", displayInfoId), rowMapper);
		}catch (EmptyResultDataAccessException e) {
			displayInfoImage = null;
		}catch (Exception e) {
			e.printStackTrace();
			displayInfoImage = null;
		}
		
		return displayInfoImage;
	}
	
	public FileInfo selectFileInfoByDisplayInfoId(int displayInfoId) {
		FileInfo fileInfo;

		try{
			BeanPropertyRowMapper<FileInfo> fileInfoRowMapper = BeanPropertyRowMapper.newInstance(FileInfo.class);

			Map<String, Object> params = new HashMap<>();
			params.put("displayInfoId", displayInfoId);
			
			fileInfo = jdbc.queryForObject(DisplayInfoImageDaoSql.SELECT_FILE_INFO_BY_DISPLAY_INFO_ID, params, fileInfoRowMapper);
		}catch (EmptyResultDataAccessException e) {
			fileInfo = null;
		}catch (Exception e) {
			e.printStackTrace();
			fileInfo = null;
		}

		return fileInfo;
	}
}
