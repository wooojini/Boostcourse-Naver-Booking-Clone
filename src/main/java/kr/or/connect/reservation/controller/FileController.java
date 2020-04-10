package kr.or.connect.reservation.controller;

import java.io.FileInputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.connect.reservation.dto.FileInfo;
import kr.or.connect.reservation.exception.FileInfoNotFoundException;
import kr.or.connect.reservation.exception.RequestArgumentNotValidException;
import kr.or.connect.reservation.service.CommentService;
import kr.or.connect.reservation.service.DisplayInfoService;
import kr.or.connect.reservation.service.ProductService;
import kr.or.connect.reservation.service.PromotionService;
import kr.or.connect.reservation.type.CategoryType;
import kr.or.connect.reservation.type.ImageType;

@Controller
@RequestMapping(path = "/download") 
public class FileController {
	@Autowired
	PromotionService promotionService;
	
	@Autowired
	ProductService productService;
	
	@Autowired
	DisplayInfoService displayInfoService;
	
	@Autowired
	CommentService commentService;
	
	@CrossOrigin
	@GetMapping(path = "/promotions")
	public void downloadPromotionImg(
			@RequestParam(required = true, name = "productId")int productId,
			HttpServletResponse response) {
		
		FileInfo fileInfo = promotionService.getPromotionFileInfo(productId);
		if(fileInfo == null) {
			throw new FileInfoNotFoundException();
		}
		
		download(fileInfo,response);
	}
	
	@CrossOrigin
	@GetMapping(path = "/products")
	public void downloadProductImg(
			@RequestParam(required = true, defaultValue = "0", name = "categoryId")int categoryId,
			@RequestParam(required = true, defaultValue = "0",name = "displayInfoId")int displayInfoId,
			HttpServletResponse response) {
		
		FileInfo fileInfo;
		if(CategoryType.ALL.getCategoryId() == categoryId) {
			fileInfo = productService.getProductFileInfoAll(displayInfoId);
		}else {
			fileInfo = productService.getProductFileInfoByCategoryId(categoryId, displayInfoId);
		}
		
		if(fileInfo == null) {
			throw new FileInfoNotFoundException();
		}
		
		download(fileInfo,response);
	}
	
	@CrossOrigin
	@GetMapping(path = "/products/{displayInfoId}")
	public void downloadProductImg(
			@RequestParam(required = true, name = "imageType")String imageType,
			@PathVariable(name = "displayInfoId")int displayInfoId,
			HttpServletResponse response) {
		
		if(!ImageType.hasImageTypeName(imageType)) {
			throw new RequestArgumentNotValidException();
		}
		
		FileInfo fileInfo = productService.getProductFileInfoByDisplayInfoId(ImageType.valueOfImageTypeName(imageType), displayInfoId);
		
		if(fileInfo == null) {
			throw new FileInfoNotFoundException();
		}
		
		download(fileInfo,response);
	}
	
	@CrossOrigin
	@GetMapping(path = "/products/detail/{displayInfoId}")
	public void downloadProductDetailImg(
			@PathVariable(name = "displayInfoId")int displayInfoId,
			HttpServletResponse response) {
		
		FileInfo fileInfo = displayInfoService.getFileInfoByDisplayInfoId(displayInfoId);
		
		if(fileInfo == null) {
			throw new FileInfoNotFoundException();
		}
		
		download(fileInfo,response);
	}
	
	@CrossOrigin
	@GetMapping(path = "/comments/{commentId}")
	public void downloadCommentImg(
			@PathVariable(name = "commentId")int commentId,
			@RequestParam(required = true, name = "displayInfoId")int displayInfoId,
			HttpServletResponse response) {
		
		FileInfo fileInfo = commentService.getFileInfo(displayInfoId, commentId);
		
		if(fileInfo == null) {
			throw new FileInfoNotFoundException();
		}
		
		download(fileInfo,response);
	}
	
	public void download(FileInfo fileInfo, HttpServletResponse response) {
		String fileName = fileInfo.getFileName();
		String saveFileName = "c:/tmp/" + fileInfo.getSaveFileName();
		String contentType = fileInfo.getContentType();
		
		response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\";");
        response.setHeader("Content-Transfer-Encoding", "binary");
        response.setHeader("Content-Type", contentType);
        response.setHeader("Pragma", "no-cache;");
        response.setHeader("Expires", "-1;");
		
        try(
        		FileInputStream fis = new FileInputStream(saveFileName);
        		OutputStream out = response.getOutputStream();
        		){
        	
        	int readCount = 0;
        	byte[] buffer = new byte[1024];
        	while((readCount = fis.read(buffer)) != -1){
        		out.write(buffer,0,readCount);
        	}

        	response.setHeader("Content-Length", "" + readCount);
        }catch(Exception ex){
        	//여기 처리 필요!!
        	throw new RuntimeException("file Save Error");
        }
	}
}
