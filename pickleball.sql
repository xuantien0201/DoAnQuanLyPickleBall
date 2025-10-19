-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 19, 2025 lúc 04:41 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `pickleball`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`id`, `session_id`, `product_id`, `quantity`, `color`, `created_at`, `updated_at`) VALUES
(26, 'session_1760457119191_2u82qhzs8', 17, 1, 'Grey', '2025-10-18 22:17:55', '2025-10-18 22:17:55'),
(27, 'session_1760457119191_2u82qhzs8', 18, 1, 'Grey', '2025-10-18 22:20:13', '2025-10-18 22:20:13'),
(36, 'session_1760853385557_rhhi6zzlm', 13, 4, 'Black', '2025-10-19 14:38:33', '2025-10-19 14:40:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image_url`, `created_at`) VALUES
(2, 'Bóng Pickleball', 'bong-pickleball', 'http://localhost:3000/uploads/categories/category-1760859170586.jfif', '2025-10-14 09:09:53'),
(3, 'Giày', 'giay', 'http://localhost:3000/uploads/categories/category-1760859178389.jpg', '2025-10-14 09:09:53'),
(4, 'Vợt Pickleball', 'vot-pickleball', 'http://localhost:3000/uploads/categories/category-1760859539376.jpg', '2025-10-14 09:09:53'),
(5, 'Phụ kiện', 'phu-kien', 'http://localhost:3000/uploads/categories/category-1760859193246.jpg', '2025-10-14 09:09:53'),
(7, 'Quần áo', 'quan-ao', 'http://localhost:3000/uploads/categories/category-1760859201049.jpg', '2025-10-14 09:31:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_code` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `shipping_address` text DEFAULT NULL,
  `shipping_city` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `shipping_city`, `notes`, `payment_method`, `total_amount`, `status`, `created_at`) VALUES
(1, '4F529F35', '1234 1234', 'xtien1812@gmail.com', '1231232', '1231', '123', '123', 'cod', 1640000, 'Processing', '2025-10-18 20:05:08'),
(2, '359FCC5A', 'Phương ngu', 'phuong@gmail.com', '09', '1231', '123', '', 'cod', 820000, 'Pending', '2025-10-18 20:33:41'),
(3, 'A82CB630', 'Nguyên ngu', 'nguyen@gmail.com', '0986868987', '123 Tran Quoc Thuong', 'Ha Noi', 'ship đẹp cho a', 'cod', 1390000, 'Pending', '2025-10-18 21:21:49'),
(4, 'E4327932', 'Khải Đeng', 'khai@gmail.com', '0986868987', 'Nguyen Trai Thanh xuan', 'Ha Noi', '123\n', 'qr', 820000, 'Processing', '2025-10-18 21:24:25'),
(5, '8C582E4B', 'Trung Nghĩa', 'trngnhia@gmail.com', '0986868984', 'Tran Hung Dao Thanh Xuan', 'Ha Noi', 'ship nhanh cho anh', 'cod', 1230000, 'Pending', '2025-10-18 21:48:17'),
(6, 'E2092BA1', 'Khách lẻ', NULL, '091238841212', NULL, NULL, NULL, 'Tiền mặt', 410000, 'Delivered', '2025-10-18 21:51:26'),
(7, '8B41379B', 'Khách lẻ 2', NULL, '09123884123', NULL, NULL, NULL, 'Chuyển khoản', 820000, 'Shipped', '2025-10-18 21:56:34'),
(8, '6455CBB8', '123', NULL, '123', NULL, NULL, NULL, 'Tiền mặt', 410000, 'Delivered', '2025-10-18 22:02:53'),
(9, '98ECB0BC', 'Khách lẻ', NULL, '1234', NULL, NULL, NULL, 'Tiền mặt', 820000, 'Delivered', '2025-10-18 22:20:09'),
(10, '635327D6', 'Tien Tran', 'xtien1812@gmail.com', '0854894838', 'no', 'HaNoi', '44', 'cod', 5000000, 'Pending', '2025-10-19 13:46:37'),
(11, 'C46255DD', '33', NULL, '44', NULL, NULL, NULL, 'Tiền mặt', 4500000, 'Delivered', '2025-10-19 13:46:46'),
(12, 'AB205804', 'Khách lẻ', NULL, '94918284', NULL, NULL, NULL, 'Tiền mặt', 5000000, 'Delivered', '2025-10-19 13:51:57'),
(13, '793A03A3', 'Khác Lạ', 'xtien1812@gmail.com', '0854894838', 'no', 'HaNoi', 'ok nhé', 'cod', 5000000, 'Pending', '2025-10-19 13:52:30'),
(14, 'C1D77ECD', 'Khác Lạ', 'xtien1812@gmail.com', '0854894838', 'no', 'HaNoi', '4', 'cod', 5000000, 'Pending', '2025-10-19 13:56:40'),
(15, '2373CC83', 'Khác Lạ 4', 'xtien14412@gmail.com', '0854894838', 'no', 'HaNoi', '4444', 'cod', 5000000, 'Delivered', '2025-10-19 14:12:09'),
(16, '29F92A2D', '444', NULL, '444', NULL, NULL, NULL, 'Tiền mặt', 410000, 'Delivered', '2025-10-19 14:15:14'),
(17, '5602F9EE', 'Khác Lạ 4', 'xtien14412@gmail.com', '0854894838', 'no', 'HaNoi', '4', 'cod', 5000000, 'Delivered', '2025-10-19 14:26:02'),
(18, 'AE6130BC', 'Tien Tran', 'xtien1812@gmail.com', '111111111', '1231', 'HaNoi', '44', 'cod', 65000000, 'Delivered', '2025-10-19 14:36:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price`, `color`) VALUES
(1, 1, 9, 'Cuốn cán chính hãng JOOLA', 3, 410000, 'Grey'),
(2, 1, 10, 'Cuốn cán chính hãng JOOLA', 1, 410000, 'Grey'),
(3, 2, 11, 'Cuốn cán chính hãng JOOLA', 1, 410000, 'Grey'),
(4, 2, 12, 'Cuốn cán chính hãng JOOLA', 1, 410000, 'Grey'),
(5, 3, 19, 'Vợt Joola jonas', 2, 490000, 'Grey'),
(6, 3, 21, 'Vợt I4', 1, 410000, 'Grey'),
(7, 4, 22, 'Vợt I4', 1, 410000, 'Grey'),
(8, 4, 23, 'Cuốn cán chính hãng JOOLA', 1, 410000, 'Grey'),
(9, 5, 24, 'Vợt I4', 2, 410000, 'Grey'),
(10, 5, 25, 'Cuốn cán chính hãng JOOLA', 1, 410000, 'Grey'),
(11, 6, 15, 'Cuốn cán chính hãng JOOLA', 1, 410000, NULL),
(12, 7, 15, 'Cuốn cán chính hãng JOOLA', 1, 410000, NULL),
(13, 7, 14, 'Cuốn cán chính hãng JOOLA', 1, 410000, NULL),
(14, 8, 14, 'Cuốn cán chính hãng JOOLA', 1, 410000, NULL),
(15, 9, 16, 'Cuốn cán chính hãng JOOLA', 1, 410000, NULL),
(16, 9, 15, 'Cuốn cán chính hãng JOOLA', 1, 410000, NULL),
(17, 10, 30, 'Tyson Mcguffin Magnus 3-14mm', 1, 5000000, 'Black'),
(18, 11, 1, 'Professional Paddle Pro', 1, 4500000, NULL),
(19, 12, 20, 'Tyson Mcguffin Magnus 3-14mm', 1, 5000000, NULL),
(20, 13, 31, 'Tyson Mcguffin Magnus 3-14mm', 1, 5000000, 'Black'),
(21, 14, 32, 'Tyson Mcguffin Magnus 3-14mm', 1, 5000000, 'Black'),
(22, 15, 33, 'Tyson Mcguffin Magnus 3-14mm', 1, 5000000, 'Black'),
(23, 16, 16, 'Cuốn cán chính hãng JOOLA', 1, 410000, NULL),
(24, 17, 34, 'Tyson Mcguffin Magnus 3-14mm', 1, 5000000, 'Black'),
(25, 18, 35, 'Tyson Mcguffin Magnus 3-14mm', 13, 5000000, 'Black');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `original_price` int(11) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors`)),
  `rating` decimal(2,1) DEFAULT 0.0,
  `reviews_count` int(11) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `is_new` tinyint(1) DEFAULT 0,
  `discount_percent` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `original_price`, `category`, `image_url`, `colors`, `rating`, `reviews_count`, `stock`, `is_new`, `discount_percent`, `created_at`, `updated_at`) VALUES
(1, 'Professional Paddle Pro', 'High-performance carbon fiber paddle with superior control and power. Perfect for competitive players.', 4500000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760859480665.webp', '[\"Black\",\"Blue\",\"Red\"]', 4.8, 127, 40, 0, NULL, '2025-10-14 09:09:53', '2025-10-19 07:38:00'),
(13, 'Tyson Mcguffin Magnus 3-14mm', 'Heavy-duty ball basket with wheels for easy transport. Holds up to 50 balls.', 5000000, 7000000, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760859474029.webp', '[\"Black\"]', 0.0, 0, 5, 0, 15, '2025-10-14 20:59:10', '2025-10-19 07:37:54'),
(14, 'Cuốn cán chính hãng JOOLA', 'Bộ 2 cái cuốn cán vợt pickleball Joola màu xám (2 cái)', 410000, 500000, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760859464199.webp', '[\"Grey\"]', 0.0, 0, 48, 0, 0, '2025-10-17 18:17:29', '2025-10-19 07:37:44'),
(17, 'Vợt I4', 'hayvcl', 410000, 500000, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760859428950.webp', '[\"Grey\"]', 0.0, 0, 50, 1, 0, '2025-10-18 09:08:12', '2025-10-19 07:44:51'),
(18, 'Vợt Joola jonas', 'new 100%', 490000, 800000, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760859153844.jpg', '[\"Grey\"]', 0.0, 0, 5, 0, 0, '2025-10-18 20:38:26', '2025-10-19 07:32:33'),
(19, 'Tyson Mcguffin Magnus 3-14mm', '123', 5000000, 7000000, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760865459989.jpg', '[\"Black\"]', 0.0, 0, 4, 0, 0, '2025-10-19 09:17:39', '2025-10-19 14:16:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `author_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_datsan`
--

CREATE TABLE `tbl_datsan` (
  `MaDatSan` int(11) NOT NULL,
  `MaSan` varchar(20) NOT NULL,
  `MaKH` varchar(20) DEFAULT NULL,
  `MaNV` varchar(20) DEFAULT NULL,
  `NgayLap` date DEFAULT NULL,
  `GioVao` time DEFAULT NULL,
  `GioRa` time DEFAULT NULL,
  `TongGio` float DEFAULT NULL,
  `TongTien` decimal(12,0) DEFAULT NULL,
  `GiamGia` decimal(12,0) DEFAULT 0,
  `TongTienThuc` decimal(12,0) DEFAULT NULL,
  `GhiChu` text DEFAULT NULL,
  `TrangThai` varchar(20) DEFAULT 'pending',
  `LoaiDat` varchar(50) DEFAULT 'Đặt sân ngày'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_datsan`
--

INSERT INTO `tbl_datsan` (`MaDatSan`, `MaSan`, `MaKH`, `MaNV`, `NgayLap`, `GioVao`, `GioRa`, `TongGio`, `TongTien`, `GiamGia`, `TongTienThuc`, `GhiChu`, `TrangThai`, `LoaiDat`) VALUES
(1, 'S1', 'KH001', 'NV001', '2025-10-15', '08:00:00', '10:00:00', 2, 200000, 0, 200000, 'Đặt sân buổi sáng', 'confirmed', 'Đặt sân ngày'),
(2, 'S2', 'KH002', 'NV002', '2025-10-13', '16:00:00', '18:00:00', 2, 320000, 20000, 300000, 'Khuyến mãi giảm 20k', 'pending', 'Đặt sân ngày'),
(3, 'S16', 'KH003', 'NV001', '2025-10-14', '15:00:00', '17:00:00', 2, 300000, 0, 300000, 'Sân VIP', 'confirmed', 'Đặt sân ngày'),
(4, 'S13', 'KH001', 'NV001', '2025-10-14', '06:00:00', '07:00:00', 1, 100000, 0, 100000, '', 'confirmed', 'Đặt sân ngày'),
(5, 'S13', 'KH001', 'NV001', '2025-10-14', '07:00:00', '08:00:00', 1, 100000, 0, 100000, '', 'confirmed', 'Đặt sân ngày'),
(6, 'S13', 'KH001', 'NV001', '2025-10-14', '08:00:00', '09:00:00', 1, 100000, 0, 100000, '', 'confirmed', 'Đặt sân ngày'),
(7, 'S16', 'KH001', 'NV001', '2025-10-14', '07:00:00', '08:00:00', 1, 150000, 0, 150000, '', 'confirmed', 'Đặt sân ngày'),
(8, 'S16', 'KH001', 'NV001', '2025-10-14', '11:00:00', '12:00:00', 1, 150000, 0, 150000, '', 'confirmed', 'Đặt sân ngày'),
(9, 'S2', 'KH002', 'NV001', '2025-10-14', '05:00:00', '06:00:00', 1, 100000, 0, 100000, '', 'confirmed', 'Đặt sân ngày'),
(10, 'S2', 'KH002', 'NV001', '2025-10-14', '06:00:00', '07:00:00', 1, 100000, 0, 100000, '', 'confirmed', 'Đặt sân ngày'),
(11, 'S2', 'KH002', 'NV001', '2025-10-14', '07:00:00', '08:00:00', 1, 100000, 0, 100000, '', 'confirmed', 'Đặt sân ngày'),
(12, 'S3', 'KH230370', 'NV001', '0000-00-00', '05:00:00', '08:00:00', 3, 300000, 0, 300000, '', 'confirmed', 'Đặt sân ngày'),
(13, 'S16', 'KH230370', 'NV001', '0000-00-00', '05:00:00', '06:00:00', 1, 150000, 0, 150000, '', 'confirmed', 'Đặt sân ngày'),
(14, 'S16', 'KH230370', 'NV001', '0000-00-00', '09:00:00', '10:00:00', 1, 150000, 0, 150000, '', 'confirmed', 'Đặt sân ngày'),
(15, 'S6', 'KH700714', 'NV001', '0000-00-00', '05:00:00', '10:00:00', 5, 500000, 0, 500000, '', 'confirmed', 'Đặt sân ngày'),
(18, 'S1', 'KH230370', 'NV001', '2025-10-14', '17:00:00', '20:00:00', 3, 480000, 0, 480000, '', 'confirmed', 'Đặt sân ngày'),
(19, 'S1', 'KH886389', 'NV001', '2025-10-14', '15:00:00', '17:00:00', 2, 200000, 0, 200000, '', 'confirmed', 'Đặt sân ngày'),
(20, 'S4', 'KH230370', 'NV001', '2025-10-14', '09:00:00', '12:00:00', 3, 300000, 0, 300000, '', 'confirmed', 'Đặt sân ngày'),
(21, 'S9', 'KH001', 'NV001', '2025-10-14', '17:00:00', '18:00:00', 1, 160000, 0, 160000, '', 'confirmed', 'Đặt sân ngày'),
(22, 'S9', 'KH001', 'NV001', '2025-10-14', '20:00:00', '21:00:00', 1, 160000, 0, 160000, '', 'confirmed', 'Đặt sân ngày'),
(23, 'S9', 'KH001', 'NV001', '2025-10-14', '07:00:00', '10:00:00', 3, 300000, 0, 300000, '', 'confirmed', 'Đặt sân ngày'),
(24, 'S14', 'KH001', 'NV001', '2025-10-14', '18:00:00', '20:00:00', 2, 320000, 0, 320000, '', 'confirmed', 'Đặt sân ngày'),
(25, 'S6', 'KH697865', 'NV001', '2025-10-14', '15:00:00', '18:00:00', 3, 300000, 0, 300000, '', 'confirmed', 'Đặt sân ngày'),
(26, 'S11', 'KH001', 'NV001', '2025-10-15', '08:00:00', '10:00:00', 2, 200000, 0, 200000, 'Đặt sân sáng', 'pending', 'Đặt sân ngày'),
(27, 'S11', 'KH230370', 'NV001', '2025-10-14', '16:00:00', '17:00:00', 1, 160000, 0, 160000, '', 'pending', 'Đặt sân ngày'),
(28, 'S11', 'KH230370', 'NV001', '2025-10-14', '18:00:00', '20:00:00', 2, 320000, 0, 320000, '', 'pending', 'Đặt sân ngày'),
(29, 'S16', 'KH230370', 'NV001', '2025-10-14', '18:00:00', '20:00:00', 2, 400000, 0, 400000, '', 'pending', 'Đặt sân ngày'),
(30, 'S12', 'KH230370', 'NV001', '2025-10-16', '06:00:00', '09:00:00', 3, 300000, 0, 300000, '', 'pending', 'Đặt sân ngày'),
(31, 'S11', 'KH001', 'NV001', '2025-10-19', '10:00:00', '13:00:00', 3, 300000, 0, 300000, '', 'pending', 'Đặt sân ngày'),
(32, 'S3', 'KH001', 'NV001', '2025-10-19', '11:00:00', '12:00:00', 1, 100000, 0, 100000, '', 'pending', 'Đặt sân ngày'),
(33, 'S4', 'KH001', 'NV001', '2025-10-19', '14:00:00', '15:00:00', 1, 100000, 0, 100000, '', 'pending', 'Đặt sân ngày'),
(34, 'S5', 'KH003', 'NV001', '2025-10-19', '16:00:00', '17:00:00', 1, 160000, 0, 160000, '', 'pending', 'Đặt sân ngày'),
(35, 'S5', 'KH003', 'NV001', '2025-10-19', '18:00:00', '19:00:00', 1, 160000, 0, 160000, '', 'pending', 'Đặt sân ngày');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_khachhang`
--

CREATE TABLE `tbl_khachhang` (
  `id` varchar(255) NOT NULL,
  `TenKh` varchar(100) NOT NULL,
  `GioiTinh` varchar(3) DEFAULT NULL,
  `SDT` varchar(12) DEFAULT NULL,
  `DiaChi` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_khachhang`
--

INSERT INTO `tbl_khachhang` (`id`, `TenKh`, `GioiTinh`, `SDT`, `DiaChi`) VALUES
('', 'a', '', '0909090909', ''),
('KH001', 'Nguyễn Văn A', 'Nam', '912345678', 'Hà Nội'),
('KH002', 'Trần Thị B', 'Nữ', '934567890', 'Đà Nẵng'),
('KH003', 'Lê Hoàng C', 'Nam', '976543210', 'TP. Hồ Chí Minh'),
('KH004', 'Phạm Minh D', 'Nam', '915678234', 'Hải Phòng'),
('KH005', 'Võ Thị E', 'Nữ', '983210456', 'Cần Thơ'),
('KH006', 'Đặng Hữu F', 'Nam', '932167890', 'Huế'),
('KH007', 'Bùi Ngọc G', 'Nữ', '945612378', 'Nha Trang'),
('KH008', 'Ngô Văn H', 'Nam', '987654321', 'Quảng Ninh'),
('KH009', 'Đỗ Thị I', 'Nữ', '961234567', 'Bắc Giang'),
('KH010', 'Phan Văn J', 'Nam', '952345678', 'Hà Nam'),
('KH011', 'Trịnh Thị K', 'Nữ', '978901234', 'Thanh Hóa'),
('KH012', 'Cao Văn L', 'Nam', '931234789', 'Nam Định'),
('KH013', 'Lưu Thị M', 'Nữ', '980112233', 'Bình Dương'),
('KH014', 'Hoàng Văn N', 'Nam', '923456789', 'Bà Rịa - Vũng Tàu'),
('KH015', 'Nguyễn Thị O', 'Nữ', '976789012', 'Long An'),
('KH230370', 'nguyen trung nguyen day', '', '0345137846', ''),
('KH266662', 'hải lý', NULL, '0912314134', ''),
('KH573815', 'a', NULL, '0909090909', ''),
('KH697865', 'abc', '', '0354553546', ''),
('KH700714', 'nguyen van thanh tung', '', '0976313548', ''),
('KH731893', 'nguyen van thanh', '', '0354553589', ''),
('KH886389', 'hey hey', '', '0654664684', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_san`
--

CREATE TABLE `tbl_san` (
  `MaSan` varchar(20) NOT NULL,
  `TenSan` varchar(100) NOT NULL,
  `LoaiSan` varchar(50) DEFAULT NULL,
  `GiaThueTruoc16` int(11) DEFAULT 100000,
  `GiaThueSau16` int(11) DEFAULT 160000,
  `TrangThai` varchar(20) DEFAULT 'Hoạt động'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_san`
--

INSERT INTO `tbl_san` (`MaSan`, `TenSan`, `LoaiSan`, `GiaThueTruoc16`, `GiaThueSau16`, `TrangThai`) VALUES
('S1', 'Sân 1', 'Thường', 100000, 160000, 'Hoạt động'),
('S10', 'Sân 10', 'Thường', 100000, 160000, 'Hoạt động'),
('S11', 'Sân 11', 'Thường', 100000, 160000, 'Hoạt động'),
('S12', 'Sân 12', 'Thường', 100000, 160000, 'Hoạt động'),
('S13', 'Sân 13', 'Thường', 100000, 160000, 'Hoạt động'),
('S14', 'Sân 14', 'Thường', 100000, 160000, 'Hoạt động'),
('S15', 'Sân 15', 'Thường', 100000, 160000, 'Hoạt động'),
('S16', 'Sân TT', 'VIP', 150000, 200000, 'Hoạt động'),
('S2', 'Sân 2', 'Thường', 100000, 160000, 'Hoạt động'),
('S3', 'Sân 3', 'Thường', 100000, 160000, 'Hoạt động'),
('S4', 'Sân 4', 'Thường', 100000, 160000, 'Hoạt động'),
('S5', 'Sân 5', 'Thường', 100000, 160000, 'Hoạt động'),
('S6', 'Sân 6', 'Thường', 100000, 160000, 'Hoạt động'),
('S7', 'Sân 7', 'Thường', 100000, 160000, 'Hoạt động'),
('S8', 'Sân 8', 'Thường', 100000, 160000, 'Hoạt động'),
('S9', 'Sân 9', 'Thường', 100000, 160000, 'Hoạt động');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_xeve_datve`
--

CREATE TABLE `tbl_xeve_datve` (
  `MaDatVe` int(11) NOT NULL,
  `MaXeVe` int(11) NOT NULL,
  `MaKH` varchar(255) NOT NULL,
  `NguoiLap` varchar(255) DEFAULT NULL,
  `SoLuongSlot` int(11) DEFAULT 1,
  `GhiChu` varchar(255) DEFAULT NULL,
  `ThoiGianDangKy` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_xeve_datve`
--

INSERT INTO `tbl_xeve_datve` (`MaDatVe`, `MaXeVe`, `MaKH`, `NguoiLap`, `SoLuongSlot`, `GhiChu`, `ThoiGianDangKy`) VALUES
(1, 1, 'KH001', NULL, 2, 'Đăng ký cùng bạn A', '2025-10-16 16:18:14'),
(2, 1, 'KH002', NULL, 1, 'Thành viên thân thiết', '2025-10-16 16:18:14'),
(3, 2, 'KH003', NULL, 3, 'Nhóm khách mới', '2025-10-16 16:18:14'),
(4, 3, 'KH004', NULL, 1, 'Khách vãng lai', '2025-10-16 16:18:14'),
(5, 4, 'KH005', NULL, 2, 'Tham gia nhóm Câu lạc bộ Pickleball', '2025-10-16 16:18:14'),
(6, 5, 'KH002', NULL, 1, 'Đăng ký lại sự kiện khác', '2025-10-16 16:18:14'),
(7, 5, 'KH003', NULL, 2, 'Bạn cùng công ty', '2025-10-16 16:18:14'),
(8, 9, 'KH573815', 'NV001', 4, 'Thanh toán bằng tt-qr', '2025-10-18 15:46:47'),
(9, 6, 'KH266662', 'NV001', 5, 'Thanh toán bằng tt-qr', '2025-10-19 03:35:41');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_xeve_sukien`
--

CREATE TABLE `tbl_xeve_sukien` (
  `MaXeVe` int(11) NOT NULL,
  `TenSuKien` varchar(100) NOT NULL,
  `DanhSachSan` varchar(100) NOT NULL,
  `ThoiGianBatDau` time NOT NULL,
  `ThoiGianKetThuc` time NOT NULL,
  `NgayToChuc` date NOT NULL,
  `TongSoNguoi` int(11) DEFAULT 0,
  `SoLuongToiDa` int(11) DEFAULT 0,
  `MaNV` varchar(10) DEFAULT NULL,
  `GhiChu` varchar(255) DEFAULT NULL,
  `TrangThai` enum('Mở','Khóa') DEFAULT 'Mở',
  `NgayTao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_xeve_sukien`
--

INSERT INTO `tbl_xeve_sukien` (`MaXeVe`, `TenSuKien`, `DanhSachSan`, `ThoiGianBatDau`, `ThoiGianKetThuc`, `NgayToChuc`, `TongSoNguoi`, `SoLuongToiDa`, `MaNV`, `GhiChu`, `TrangThai`, `NgayTao`) VALUES
(1, 'Giải Pickleball Cuối Tuần', 'S9, S10, S11, TT', '08:00:00', '12:00:00', '2025-10-20', 28, 32, 'NV01', 'Giải đấu phong trào hàng tuần', 'Khóa', '2025-10-15 17:41:30'),
(2, 'Giải Giao Hữu Sáng Thứ 7', 'S1, S2, S3', '06:00:00', '09:00:00', '2025-10-18', 18, 24, 'NV02', 'Chỉ dành cho hội viên', 'Khóa', '2025-10-15 17:41:30'),
(3, 'Pickleball Championship', 'S12, S13, S14', '13:00:00', '17:00:00', '2025-10-25', 30, 36, 'NV03', 'Giải đấu cấp câu lạc bộ', 'Mở', '2025-10-15 17:41:30'),
(4, 'Mini Challenge Buổi Tối', 'S4, S5, S6, S7', '18:00:00', '21:00:00', '2025-10-22', 20, 28, 'NV01', 'Giải vui dành cho người mới', 'Mở', '2025-10-15 17:41:30'),
(5, 'Giải Pickleball Mùa Hè', 'S1,S2,S3', '08:00:00', '11:00:00', '2025-08-30', 20, 50, 'NV01', 'Sửa thông tin sự kiện', 'Khóa', '2025-10-15 17:41:30'),
(6, 'Giải Pickleball Mùa Thu', 'S1,S2,S3', '07:00:00', '12:00:00', '2025-11-01', 0, 30, 'NV001', 'Sự kiện thử nghiệm hệ thống', 'Mở', '2025-10-16 19:21:23'),
(9, 'Giao lưu cùng Tún Hưng', 'S9,S11,S10,S12', '13:00:00', '17:00:00', '2025-11-20', 0, 32, 'NV001', '', 'Mở', '2025-10-17 17:17:50');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `tbl_datsan`
--
ALTER TABLE `tbl_datsan`
  ADD PRIMARY KEY (`MaDatSan`),
  ADD KEY `fk_datsan_san` (`MaSan`),
  ADD KEY `fk_datsan_khachhang` (`MaKH`);

--
-- Chỉ mục cho bảng `tbl_khachhang`
--
ALTER TABLE `tbl_khachhang`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tbl_san`
--
ALTER TABLE `tbl_san`
  ADD PRIMARY KEY (`MaSan`);

--
-- Chỉ mục cho bảng `tbl_xeve_datve`
--
ALTER TABLE `tbl_xeve_datve`
  ADD PRIMARY KEY (`MaDatVe`),
  ADD KEY `MaXeVe` (`MaXeVe`),
  ADD KEY `MaKH` (`MaKH`);

--
-- Chỉ mục cho bảng `tbl_xeve_sukien`
--
ALTER TABLE `tbl_xeve_sukien`
  ADD PRIMARY KEY (`MaXeVe`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tbl_datsan`
--
ALTER TABLE `tbl_datsan`
  MODIFY `MaDatSan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `tbl_xeve_datve`
--
ALTER TABLE `tbl_xeve_datve`
  MODIFY `MaDatVe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `tbl_xeve_sukien`
--
ALTER TABLE `tbl_xeve_sukien`
  MODIFY `MaXeVe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tbl_datsan`
--
ALTER TABLE `tbl_datsan`
  ADD CONSTRAINT `fk_datsan_khachhang` FOREIGN KEY (`MaKH`) REFERENCES `tbl_khachhang` (`id`),
  ADD CONSTRAINT `fk_datsan_san` FOREIGN KEY (`MaSan`) REFERENCES `tbl_san` (`MaSan`);

--
-- Các ràng buộc cho bảng `tbl_xeve_datve`
--
ALTER TABLE `tbl_xeve_datve`
  ADD CONSTRAINT `tbl_xeve_datve_ibfk_1` FOREIGN KEY (`MaXeVe`) REFERENCES `tbl_xeve_sukien` (`MaXeVe`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_xeve_datve_ibfk_2` FOREIGN KEY (`MaKH`) REFERENCES `tbl_khachhang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
