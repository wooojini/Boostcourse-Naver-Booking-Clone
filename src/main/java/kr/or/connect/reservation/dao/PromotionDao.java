package kr.or.connect.reservation.dao;

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

import kr.or.connect.reservation.dao.sql.PromotionDaoSql;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Promotion;
import kr.or.connect.reservation.type.ImageType;

@Repository
public class PromotionDao {
	private NamedParameterJdbcTemplate jdbc;
	private RowMapper<Promotion> rowMapper =  BeanPropertyRowMapper.newInstance(Promotion.class);
	private SimpleJdbcInsert insertAction;
	
	public PromotionDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public List<Promotion> selectAll(){
		Map<String, String> params = new HashMap<>();
		params.put("imageType", ImageType.THUMBNAIL.getImageTypeName());
		
		return jdbc.query(PromotionDaoSql.SELECT_ALL,params,rowMapper);
	}
	
	public FileInfo selectFileInfoById(int productId) {
		FileInfo fileInfo;
		
		try {
			BeanPropertyRowMapper<FileInfo> fileInfoRowMapper = BeanPropertyRowMapper.newInstance(FileInfo.class);
			
			Map<String, Object> params = new HashMap<>();
			params.put("imageType", ImageType.THUMBNAIL.getImageTypeName());
			params.put("productId", productId);
			fileInfo = jdbc.queryForObject(PromotionDaoSql.SELECT_FILE_INFO_BY_ID, params,  fileInfoRowMapper);
		}catch(EmptyResultDataAccessException e){
			fileInfo = null;
		}catch(Exception e) {
			e.printStackTrace();
			fileInfo = null;
		}
		
		return fileInfo;
	}
}
