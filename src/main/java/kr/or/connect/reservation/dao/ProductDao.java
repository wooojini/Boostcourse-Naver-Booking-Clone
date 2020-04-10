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

import kr.or.connect.reservation.dao.sql.ProductDaoSql;
import kr.or.connect.reservation.dao.sql.PromotionDaoSql;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Product;
import kr.or.connect.reservation.type.ImageType;

@Repository
public class ProductDao {
	private NamedParameterJdbcTemplate jdbc;
	private RowMapper<Product> rowMapper = BeanPropertyRowMapper.newInstance(Product.class);
	private SimpleJdbcInsert insertAction;
	
	public ProductDao(DataSource dataSource) {
		this.jdbc = new NamedParameterJdbcTemplate(dataSource);
	}
	
	public List<Product> selectProductsAll(int start, int limit){
		Map<String, Object> params = new HashMap<>();
		params.put("start", start);
		params.put("limit", limit);
		params.put("imageType", ImageType.THUMBNAIL.getImageTypeName());
		
		return jdbc.query(ProductDaoSql.SELECT_PRODUCTS_ALL,params,rowMapper);
	}
	
	public List<Product> selectProductsByCategoryId(int categoryId, int start, int limit){
		Map<String, Object> params = new HashMap<>();
		params.put("categoryId", categoryId);
		params.put("start", start);
		params.put("limit", limit);
		params.put("imageType", ImageType.THUMBNAIL.getImageTypeName());
		
		return jdbc.query(ProductDaoSql.SELECT_PRODUCTS_BY_CATEGORY_ID,params,rowMapper);
	}
	
	public int selectCountAll() {
		return jdbc.queryForObject(ProductDaoSql.SELECT_COUNT_ALL,Collections.emptyMap(), int.class);
	}
	
	public int selectCountByCategoryId(int categoryId) {
		return jdbc.queryForObject(ProductDaoSql.SELECT_COUNT_BY_CATEGORY_ID, Collections.singletonMap("categoryId", categoryId), int.class);
	}
	
	public FileInfo selectFileInfoByCategoryId(int categoryId, int displayInfoId) {
		FileInfo fileInfo;
		
		try {
			BeanPropertyRowMapper<FileInfo> fileInfoRowMapper = BeanPropertyRowMapper.newInstance(FileInfo.class);
			
			Map<String, Object> params = new HashMap<>();
			params.put("imageType", ImageType.THUMBNAIL.getImageTypeName());
			params.put("categoryId", categoryId);
			params.put("displayInfoId", displayInfoId);
			
			fileInfo = jdbc.queryForObject(ProductDaoSql.SELECT_FILE_INFO_BY_CATEGORY_ID, params,  fileInfoRowMapper);
		}catch(EmptyResultDataAccessException e){
			fileInfo = null;
		}catch(Exception e) {
			e.printStackTrace();
			fileInfo = null;
		}
		
		return fileInfo;
	}
	
	public FileInfo selectFileInfoAll(int displayInfoId) {
		FileInfo fileInfo;
		
		try {
			BeanPropertyRowMapper<FileInfo> fileInfoRowMapper = BeanPropertyRowMapper.newInstance(FileInfo.class);
			
			Map<String, Object> params = new HashMap<>();
			params.put("imageType", ImageType.THUMBNAIL.getImageTypeName());
			params.put("displayInfoId", displayInfoId);
			
			fileInfo = jdbc.queryForObject(ProductDaoSql.SELECT_FILE_INFO_ALL, params,  fileInfoRowMapper);
		}catch(EmptyResultDataAccessException e){
			fileInfo = null;
		}catch(Exception e) {
			e.printStackTrace();
			fileInfo = null;
		}
		
		return fileInfo;
	}
}
