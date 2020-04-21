package kr.or.connect.reservation.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.or.connect.reservation.dao.FileInfoDao;
import kr.or.connect.reservation.dao.PromotionDao;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Promotion;
import kr.or.connect.reservation.service.PromotionService;

@Service
public class PromotionServiceImpl implements PromotionService {
  @Autowired
  private PromotionDao promotionDao;

  @Autowired
  private FileInfoDao fileInfoDao;

  @Override
  @Transactional(readOnly = true)
  public List<Promotion> getPromotions() {
    return promotionDao.selectAll();
  }

  @Override
  @Transactional(readOnly = true)
  public FileInfo getPromotionFileInfo(int productImageId) {
    return fileInfoDao.selectByProductImageId(productImageId);
  }
}
