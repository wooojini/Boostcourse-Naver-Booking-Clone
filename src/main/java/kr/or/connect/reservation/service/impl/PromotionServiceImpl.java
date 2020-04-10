package kr.or.connect.reservation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.reservation.dao.PromotionDao;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.dto.Promotion;
import kr.or.connect.reservation.service.PromotionService;

@Service
public class PromotionServiceImpl implements PromotionService {
	@Autowired
	private PromotionDao promotionDao;
	
	@Override
	@Transactional
	public List<Promotion> getPromotions() {
		return promotionDao.selectAll();
	}
	
	@Override
	@Transactional
	public FileInfo getPromotionFileInfo(int productId) {
		return promotionDao.selectFileInfoById(productId);
	}
}
