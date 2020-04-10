package kr.or.connect.reservation.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.reservation.dao.DisplayInfoDao;
import kr.or.connect.reservation.dao.DisplayInfoImageDao;
import kr.or.connect.reservation.dto.DisplayInfo;
import kr.or.connect.reservation.dto.DisplayInfoImage;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.service.DisplayInfoService;

@Service
public class DisplayInfoServiceImpl implements DisplayInfoService {	
	@Autowired
	private DisplayInfoDao displayInfoDao;
	@Autowired
	private DisplayInfoImageDao displayInfoImageDao;
	
	@Override
	@Transactional
	public DisplayInfo getDisplayInfoById(int displayInfoId) {
		return displayInfoDao.selectById(displayInfoId);
	}
	
	@Override
	@Transactional
	public DisplayInfoImage getImagesByDisplayInfoId(int displayInfoId) {
		return displayInfoImageDao.selectByDisplayInfoId(displayInfoId);
	}

	@Override
	@Transactional
	public FileInfo getFileInfoByDisplayInfoId(int displayInfoId) {
		return displayInfoImageDao.selectFileInfoByDisplayInfoId(displayInfoId);
	}
}
