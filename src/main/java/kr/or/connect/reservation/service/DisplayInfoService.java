package kr.or.connect.reservation.service;

import org.springframework.stereotype.Service;

import kr.or.connect.reservation.dto.DisplayInfo;
import kr.or.connect.reservation.dto.DisplayInfoImage;
import kr.or.connect.reservation.dto.FileInfo;

@Service
public interface DisplayInfoService {
	public DisplayInfo getDisplayInfoById(int displayInfoId);
	public DisplayInfoImage getImagesByDisplayInfoId(int displayInfoId);
	public FileInfo getFileInfoByDisplayInfoId(int displayInfoId);
}
