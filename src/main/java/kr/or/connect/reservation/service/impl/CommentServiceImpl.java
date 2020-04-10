package kr.or.connect.reservation.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.connect.reservation.dao.CommentDao;
import kr.or.connect.reservation.dao.CommentImageDao;
import kr.or.connect.reservation.dto.Comment;
import kr.or.connect.reservation.dto.CommentImage;
import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.service.CommentService;

@Service
public class CommentServiceImpl implements CommentService {	
	@Autowired
	private CommentDao commentDao;
	@Autowired
	private CommentImageDao	commentImageDao;
	
	@Override
	@Transactional
	public List<Comment> getCommentsByDisplayInfoId(int displayInfoId) {
		return commentDao.selectByDisplayInfoId(displayInfoId);
	}
	
	@Override
	@Transactional
	public double getAveScoreByDisplayInfoId(int displayInfoId) {
		return commentDao.selectAvgScoreByDisplayInfoId(displayInfoId);
	}
	
	@Override
	@Transactional
	public List<CommentImage> getCommentImages(int displayInfoId, int commentId) {
		return commentImageDao.selectByDisplayInfoId(displayInfoId, commentId);
	}

	@Override
	@Transactional
	public FileInfo getFileInfo(int displayInfoId, int commentId) {
		return commentImageDao.selectFileInfo(displayInfoId, commentId);
	}
}
