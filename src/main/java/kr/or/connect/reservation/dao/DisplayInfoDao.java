package kr.or.connect.reservation.dao;

import java.util.Collections;

import javax.sql.DataSource;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.annotation.ResponseStatusExceptionResolver;

import kr.or.connect.reservation.dao.sql.DisplayInfoDaoSql;
import kr.or.connect.reservation.dto.DisplayInfo;


@Repository
public class DisplayInfoDao {
	private NamedParameterJdbcTemplate jdbc;
	private RowMapper<DisplayInfo> rowMapper = BeanPropertyRowMapper.newInstance(DisplayInfo.class);
	private SimpleJdbcInsert insertAction;
	
	public DisplayInfoDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public DisplayInfo selectById(int displayInfoId){
		DisplayInfo displayInfo;
		
		try {
			displayInfo = (DisplayInfo) jdbc.queryForObject(DisplayInfoDaoSql.SELECT_BY_ID, Collections.singletonMap("displayInfoId", displayInfoId), rowMapper);
		}catch (EmptyResultDataAccessException e) {
			displayInfo = null;
		}catch (Exception e) {
			e.printStackTrace();
			displayInfo = null;
		}
		
		return displayInfo;
	}
}
