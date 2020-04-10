package kr.or.connect.reservation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.reservation.dao.ProductDao;
import kr.or.connect.reservation.dao.ProductImageDao;
import kr.or.connect.reservation.dao.ProductPriceDao;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Product;
import kr.or.connect.reservation.dto.ProductImage;
import kr.or.connect.reservation.dto.ProductPrice;
import kr.or.connect.reservation.service.ProductService;
import kr.or.connect.reservation.type.CategoryType;
import kr.or.connect.reservation.type.ImageType;

@Service
public class ProductServiceImpl implements ProductService {
	@Autowired
	private ProductDao productDao;
	@Autowired
	private ProductImageDao productImageDao;
	@Autowired
	private ProductPriceDao productPriceDao;
	
	@Override
	@Transactional
	public List<Product> getProductsAll(int start) {
		return productDao.selectProductsAll(start, ProductService.LIMIT);
	}

	@Override
	@Transactional
	public List<Product> getProductsByCategoryId(int categoryId, int start) {
		return productDao.selectProductsByCategoryId(categoryId, start, ProductService.LIMIT);
	}

	@Override
	@Transactional
	public int getProductCountAll() {
		return productDao.selectCountAll();	
	}

	@Override
	@Transactional
	public int getProductCountByCategoryId(int categoryId) {
		return productDao.selectCountByCategoryId(categoryId);
	}
	
	@Override
	@Transactional
	public List<ProductImage> getImagesByDisplayInfoId(int displayInfoId) {
		return productImageDao.selectByDisplayInfoId(displayInfoId);
	}

	@Override
	@Transactional
	public List<ProductPrice> getPricesByDisplayInfoId(int displayInfoId) {
		return productPriceDao.selectByDisplayInfoId(displayInfoId);
	}
	
	@Override
	@Transactional
	public FileInfo getProductFileInfoByCategoryId(int categoryId, int displayInfoId) {
		return productDao.selectFileInfoByCategoryId(categoryId, displayInfoId);
	}

	@Override
	@Transactional
	public FileInfo getProductFileInfoAll(int displayInfoId) {
		return productDao.selectFileInfoAll(displayInfoId);
	}
	
	@Override
	@Transactional
	public FileInfo getProductFileInfoByDisplayInfoId(ImageType imageType, int displayInfoId) {
		return productImageDao.selectFileInfoByDisplayInfoId(imageType, displayInfoId);
	}
}
