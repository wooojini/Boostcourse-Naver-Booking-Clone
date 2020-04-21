package kr.or.connect.reservation.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.or.connect.reservation.dao.FileInfoDao;
import kr.or.connect.reservation.dao.ProductDao;
import kr.or.connect.reservation.dao.ProductImageDao;
import kr.or.connect.reservation.dao.ProductPriceDao;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Product;
import kr.or.connect.reservation.dto.ProductImage;
import kr.or.connect.reservation.dto.ProductPrice;
import kr.or.connect.reservation.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
  @Autowired
  private ProductDao productDao;

  @Autowired
  private ProductImageDao productImageDao;

  @Autowired
  private ProductPriceDao productPriceDao;

  @Autowired
  private FileInfoDao fileInfoDao;

  @Override
  @Transactional(readOnly = true)
  public List<Product> getProductsAll(int start) {
    return productDao.selectProductsAll(start, ProductService.LIMIT);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Product> getProductsByCategoryId(int categoryId, int start) {
    return productDao.selectProductsByCategoryId(categoryId, start, ProductService.LIMIT);
  }

  @Override
  @Transactional(readOnly = true)
  public int getProductCountAll() {
    return productDao.selectCountAll();
  }

  @Override
  @Transactional(readOnly = true)
  public int getProductCountByCategoryId(int categoryId) {
    return productDao.selectCountByCategoryId(categoryId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ProductImage> getImagesByDisplayInfoId(int displayInfoId) {
    return productImageDao.selectByDisplayInfoId(displayInfoId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ProductPrice> getPricesByDisplayInfoId(int displayInfoId) {
    return productPriceDao.selectByDisplayInfoId(displayInfoId);
  }

  @Override
  @Transactional(readOnly = true)
  public FileInfo getProductFileInfoByProductImgId(int productImageId) {
    return fileInfoDao.selectByProductImageId(productImageId);
  }
}
