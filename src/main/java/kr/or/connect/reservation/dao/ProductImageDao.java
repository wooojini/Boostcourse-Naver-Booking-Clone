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

import kr.or.connect.reservation.dao.sql.ProductImageDaoSql;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.ProductImage;
import kr.or.connect.reservation.type.ImageType;

@Repository
public class ProductImageDao {
	private NamedParameterJdbcTemplate jdbc;
	private RowMapper<ProductImage> rowMapper = BeanPropertyRowMapper.newInstance(ProductImage.class);
	private SimpleJdbcInsert insertAction;
	
	public ProductImageDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public List<ProductImage> selectByDisplayInfoId(int displayInfoId){
		return jdbc.query(ProductImageDaoSql.SELECT_BY_DISPLAY_INFO_ID, Collections.singletonMap("displayInfoId", displayInfoId),rowMapper);
	}
	
	public FileInfo selectFileInfoByDisplayInfoId(ImageType imageType,int displayInfoId) {
		FileInfo fileInfo;
		
		try {
			BeanPropertyRowMapper<FileInfo> fileInfoRowMapper = BeanPropertyRowMapper.newInstance(FileInfo.class);
			
			Map<String, Object> params = new HashMap<>();
			params.put("imageType", imageType.getImageTypeName());
			params.put("displayInfoId", displayInfoId);
			params.put("limit", ProductImageDaoSql.ETC_IMG_LIMIT);
						
			fileInfo = jdbc.queryForObject(ProductImageDaoSql.SELECT_FILE_INFO_BY_DISPLAY_INFO_ID, params, fileInfoRowMapper);
			
		}catch (EmptyResultDataAccessException e) {
			fileInfo = null;
		}catch(Exception e) {
			e.printStackTrace();
			fileInfo = null;
		}
		
		return fileInfo;
	}
}
