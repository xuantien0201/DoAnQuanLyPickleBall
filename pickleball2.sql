-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 22, 2025 lúc 09:54 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `pickleball2`
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
(42, '19078709', '445', '312@gmail.com', '0984747372', '1231', 'HaNoi', '444', 'cod', 4800000, 'Pending', '2025-10-20 02:25:35'),
(43, 'EAF0AF92', '445', '312@gmail.com', '0984747372', '1231', 'HaNoi', '6', 'cod', 4800000, 'Pending', '2025-10-20 02:31:30');

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
(44, 42, 28, 'Anna Bright Scorpeus 3 14mm', 1, 4800000, 'Pink'),
(45, 43, 28, 'Anna Bright Scorpeus 3 14mm', 1, 4800000, 'Pink');

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
(28, 'Anna Bright Scorpeus 3 14mm', 'Vợt nhẹ với khả năng kiểm soát tuyệt vời, dòng signature của Anna Bright.', 4800000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925530248.webp', '[\"Pink\",\"White\"]', 4.8, 110, 40, 1, NULL, '2025-10-20 01:43:44', '2025-10-20 02:07:56'),
(29, 'Ben Johns Blue Lightning Set', 'Bộ vợt và phụ kiện Ben Johns phiên bản Blue Lightning.', 5200000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925520526.webp', '[\"Blue\",\"Silver\"]', 4.9, 200, 30, 1, NULL, '2025-10-20 01:43:44', '2025-10-20 02:08:00'),
(30, 'Ben Johns Hyperion 3 14mm', 'Vợt Ben Johns Hyperion thế hệ 3, dày 14mm.', 4950000, 5500000, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925515107.webp', '[\"Black\",\"Yellow\"]', 4.8, 180, 60, 0, 10, '2025-10-20 01:43:44', '2025-10-20 01:59:01'),
(31, 'Ben Johns Perseus 3 14mm', 'Vợt Ben Johns Perseus thế hệ 3, dày 14mm, tối ưu sức mạnh.', 4900000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925509481.webp', '[\"Black\",\"Red\"]', 4.9, 210, 55, 0, 10, '2025-10-20 01:43:44', '2025-10-20 02:08:36'),
(32, 'Ben Johns Perseus 3 16mm', 'Vợt Ben Johns Perseus thế hệ 3, dày 16mm, tăng cường kiểm soát.', 5100000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925500714.webp', '[\"Black\",\"Gold\"]', 4.9, 250, 45, 1, NULL, '2025-10-20 01:43:44', '2025-10-20 02:08:06'),
(33, 'Collin Johns Scorpeus 3 16mm', 'Vợt Collin Johns Scorpeus thế hệ 3, dày 16mm.', 4750000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925494391.webp', '[\"Blue\",\"White\"]', 4.8, 130, 65, 1, NULL, '2025-10-20 01:43:44', '2025-10-20 02:08:09'),
(34, 'Joola Agassi Set', 'Bộ vợt Joola Agassi phiên bản đặc biệt.', 5500000, 6000000, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925489056.webp', '[\"Black\",\"Neon\"]', 4.7, 80, 25, 0, 8, '2025-10-20 01:43:44', '2025-10-20 01:59:14'),
(35, 'Joola Britto Hearts', 'Vợt Joola phiên bản Britto Hearts nghệ thuật.', 4600000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925482860.webp', '[\"Multicolor\"]', 4.6, 70, 35, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:58:02'),
(36, 'Joola Collin Johns 16mm Gen3', 'Vợt Joola Collin Johns Gen 3, dày 16mm.', 5300000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925474314.webp', '[\"Silver\",\"Blue\"]', 4.9, 140, 50, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:57:54'),
(37, 'Joola Perseus 16mm Pro Player', 'Vợt Joola Perseus 16mm phiên bản dành cho vận động viên chuyên nghiệp.', 5800000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925447613.webp', '[\"Carbon\",\"Red\"]', 5.0, 90, 20, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:57:27'),
(38, 'Method Cb 12', 'Vợt Joola Method CB 12.', 3500000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925438489.webp', '[\"Gray\",\"Orange\"]', 4.5, 60, 80, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:57:31'),
(39, 'Tyson Mcguffin Magnus 3 14mm', 'Vợt Tyson Mcguffin Magnus 3, dày 14mm.', 4850000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925430606.webp', '[\"Red\",\"Black\"]', 4.8, 115, 40, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:57:34'),
(40, 'Tyson Mcguffin Magnus 3 16mm', 'Vợt Tyson Mcguffin Magnus 3, dày 16mm.', 4950000, 5200000, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925422283.webp', '[\"Red\",\"White\",\"Black\"]', 4.9, 160, 35, 0, 5, '2025-10-20 01:43:44', '2025-10-20 01:57:37'),
(41, 'Vot Joola Ben Johns Hyperion Cgs 16', 'Vợt Joola Ben Johns Hyperion CGS 16.', 4700000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925412693.webp', '[\"Black\",\"Gray\"]', 4.7, 125, 70, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:57:43'),
(42, 'Vot Joola Ben Johns Hyperion Cas 135', 'Vợt Joola Ben Johns Hyperion CAS 13.5.', 4650000, NULL, 'Vợt Pickleball', 'http://localhost:3000/uploads/products/product-1760925400676.webp', '[\"Blue\",\"Black\"]', 4.7, 105, 65, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:56:40'),
(43, 'Heleus Pickleball Pools', 'Bóng pickleball Heleus độ nảy chuẩn, bền bỉ.', 250000, NULL, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760925376892.webp', '[\"Yellow\"]', 4.8, 250, 200, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:56:16'),
(44, 'Heleus Pickleballs 4 Pack', 'Hộp 4 bóng pickleball Heleus tiêu chuẩn thi đấu.', 350000, 400000, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760925369335.webp', '[\"Yellow\",\"Orange\"]', 4.9, 300, 150, 0, 13, '2025-10-20 01:43:44', '2025-10-20 01:56:09'),
(45, 'Bóng tập 50 quả', 'Bóng pickleball chất lượng cao.', 200000, NULL, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760925361505.webp', '[\"Green\"]', 4.6, 180, 300, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:56:01'),
(46, 'Joola Primo 3 Star 20 Pack', 'Hộp 20 bóng Joola Primo 3 sao.', 1500000, NULL, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760925334317.webp', '[\"White\"]', 4.9, 120, 80, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:55:34'),
(47, 'Joola Primo 3 Star 4 Pack', 'Hộp 4 bóng Joola Primo 3 sao.', 320000, NULL, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760925327601.webp', '[\"White\",\"Yellow\"]', 4.8, 280, 250, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:55:27'),
(48, 'Bong Pickleball Joola Primo 4 Qua', 'Bóng Joola Primo, hộp 4 quả.', 300000, 350000, 'Bóng Pickleball', 'http://localhost:3000/uploads/products/product-1760925301614.webp', '[\"Yellow\"]', 4.7, 220, 180, 0, 14, '2025-10-20 01:43:44', '2025-10-20 01:55:01'),
(49, 'Balo Joola Agassi Vision II', 'Balo đựng vợt Joola Agassi Vision II.', 1800000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925293815.webp', '[\"Black\",\"Silver\"]', 4.8, 90, 60, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:54:53'),
(50, 'Balo Six Zero Pro Tour', 'Balo chuyên nghiệp Six Zero Pro Tour màu đen hồng.', 2200000, 2500000, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925286020.webp', '[\"Black\",\"Pink\"]', 4.9, 75, 40, 0, 12, '2025-10-20 01:43:44', '2025-10-20 01:54:46'),
(51, 'Cuon Can Chinh Hang Joola', 'Cuốn cán vợt chính hãng Joola.', 150000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925279059.webp', '[\"Gray\",\"White\",\"Black\"]', 4.7, 300, 500, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:54:39'),
(52, 'Edge Tape 24mm', 'Băng dán cạnh vợt 24mm.', 120000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925272524.webp', '[\"Black\",\"Red\",\"Blue\"]', 4.6, 450, 800, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:54:32'),
(53, 'Joola Trinity Wristband White', 'Băng đeo cổ tay Joola Trinity màu trắng.', 250000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925252984.webp', '[\"White\"]', 4.8, 180, 200, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:54:12'),
(54, 'Joola Vision II Backpack', 'Balo Joola Vision II.', 1750000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925263499.webp', '[\"Black\"]', 4.7, 110, 70, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:54:23'),
(55, 'Joola Vision II Backpack Petrol Teal', 'Balo Joola Vision II màu xanh xăng.', 1850000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925245444.webp', '[\"Teal\",\"Petrol\"]', 4.8, 95, 55, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:54:05'),
(56, 'Luoi Pasion Pro 11', 'Lưới Pasion Pro 11.', 3500000, 4000000, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925238629.webp', '[\"Black\"]', 4.9, 50, 30, 0, 13, '2025-10-20 01:43:44', '2025-10-20 01:53:58'),
(57, 'Mu Pickleball Joola Essential Cap Gray', 'Mũ Joola Essential màu xám.', 450000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925231393.webp', '[\"Gray\"]', 4.7, 150, 100, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:53:51'),
(58, 'Mu Pickleball Joola Essential Green', 'Mũ Joola Essential màu xanh lá.', 450000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925222433.webp', '[\"Green\"]', 4.7, 130, 110, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:53:42'),
(59, 'Mu Pickleball Joola Essential Visor Navy', 'Mũ lưỡi trai Joola Essential màu navy.', 420000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925215831.webp', '[\"Navy\"]', 4.8, 160, 120, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:53:35'),
(60, 'Premium Overgrip 4 Pack', 'Bộ 4 cuốn cán cao cấp.', 280000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925209768.webp', '[\"White\",\"Black\"]', 4.9, 400, 600, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:53:29'),
(61, 'Replacement Grip Feel Tec Pure', 'Cuốn cốt vợt Feel Tec Pure.', 350000, NULL, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925198612.webp', '[\"Black\"]', 4.8, 250, 300, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:53:18'),
(62, 'Túi Vợt Pickleball Slim', 'Túi đựng vợt pickleball dạng mỏng.', 850000, 950000, 'Phụ kiện', 'http://localhost:3000/uploads/products/product-1760925188393.webp', '[\"Gray\",\"Black\"]', 4.7, 120, 90, 0, 11, '2025-10-20 01:43:44', '2025-10-20 01:53:08'),
(63, 'Mens Club Polo Black', 'Áo polo nam màu đen.', 890000, NULL, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925168199.webp', '[\"Black\"]', 4.8, 80, 100, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:52:48'),
(64, 'Mens Club Polo White', 'Áo polo nam màu trắng.', 890000, NULL, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925160147.webp', '[\"White\"]', 4.8, 95, 120, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:52:40'),
(65, 'Mens Woven Shorts White', 'Quần short nam dệt màu trắng.', 750000, NULL, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925151535.webp', '[\"White\"]', 4.7, 70, 150, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:52:31'),
(66, 'Mens Club Printed Polo Safari', 'Áo polo nam in họa tiết Safari.', 950000, 1100000, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925138076.webp', '[\"White\",\"Leopard\"]', 4.9, 50, 80, 0, 14, '2025-10-20 01:43:44', '2025-10-20 01:52:18'),
(67, 'Mens 2 In 1 Shorts Latte', 'Quần short 2 trong 1 màu latte.', 990000, NULL, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925131661.webp', '[\"Latte\"]', 4.8, 65, 90, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:52:11'),
(68, 'Mens Club Shorts Navy', 'Quần short nam màu navy.', 1950000, 2500000, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925123012.webp', '[\"Navy\"]', 4.7, 85, 130, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:52:03'),
(69, 'Womens Club Skirt Blue Breeze', 'Chân váy nữ màu xanh.', 1430000, 1800000, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925107214.webp', '[\"Blue\"]', 4.9, 60, 70, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:51:47'),
(70, 'Womens Club Novelty Polo Dress', 'Váy polo nữ màu trắng.', 2860000, 3000000, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760925054080.webp', '[\"White\"]', 4.8, 55, 60, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:50:54'),
(71, 'Giày Nikecourt Air Zoom Vapor Pro 2', 'Giày tennis Nikecourt Air Zoom Vapor Pro 2.', 2849999, 3000000, 'Giày', 'http://localhost:3000/uploads/products/product-1760924938678.webp', '[\"White\",\"Black\"]', 4.9, 120, 10, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 02:13:41'),
(72, 'Giày Pickleball Asics', 'Giày pickleball Asics.', 2500000, 2800000, 'Giày', 'http://localhost:3000/uploads/products/product-1760924875745.webp', '[\"Blue\",\"Yellow\"]', 4.8, 100, 90, 0, 11, '2025-10-20 01:43:44', '2025-10-20 02:13:49'),
(73, 'Giày Pickleball Asics 1042a211400', 'Giày pickleball Asics 1042a211400.', 2850000, 3200000, 'Quần áo', 'http://localhost:3000/uploads/products/product-1760924830006.webp', '[\"Red\",\"White\"]', 4.8, 90, 75, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 01:49:25'),
(74, 'Giày Nikecourt Air Zoom Vapor Pro 2', 'Giày Nikecourt Air Zoom Vapor Pro 2.', 2850000, 3200000, 'Giày', 'http://localhost:3000/uploads/products/product-1760924795156.webp', '[\"Black\",\"Gold\"]', 4.9, 150, 65, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 02:14:03'),
(75, 'Giày Nike Zoom Gp Challenge 1 Premium', 'Giày Nike Zoom GP Challenge 1 Premium.', 2999000, 3500000, 'Giày', 'http://localhost:3000/uploads/products/product-1760924763695.webp', '[\"White\",\"Multicolor\"]', 4.9, 110, 50, 0, NULL, '2025-10-20 01:43:44', '2025-10-20 02:13:58');

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
(35, 'S5', 'KH003', 'NV001', '2025-10-19', '18:00:00', '19:00:00', 1, 160000, 0, 160000, '', 'pending', 'Đặt sân ngày'),
(36, 'S13', 'KH001', 'NV001', '2025-10-20', '11:00:00', '13:00:00', 2, 200000, 0, 200000, '', 'pending', 'Đặt sân ngày'),
(37, 'S3', 'KH001', 'NV001', '2025-10-22', '10:00:00', '13:00:00', 3, 300000, 0, 300000, '', 'pending', 'Đặt sân ngày'),
(38, 'S7', 'KH600675', 'NV001', '2025-10-22', '10:00:00', '14:00:00', 4, 400000, 0, 400000, '', 'pending', 'Đặt sân ngày'),
(39, 'S8', 'KH614639', 'NV001', '2025-10-22', '10:00:00', '14:00:00', 4, 400000, 0, 400000, '', 'pending', 'Đặt sân ngày');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_datsanthang`
--

CREATE TABLE `tbl_datsanthang` (
  `MaDatSanThang` varchar(20) NOT NULL,
  `MaKH` varchar(20) NOT NULL,
  `MaNV` varchar(20) NOT NULL,
  `DanhSachSan` text NOT NULL,
  `NgayBatDau` date NOT NULL,
  `NgayKetThuc` date NOT NULL,
  `DanhSachNgay` text NOT NULL,
  `GioBatDau` time NOT NULL,
  `GioKetThuc` time NOT NULL,
  `TongGio` int(11) NOT NULL,
  `TongTien` decimal(15,2) NOT NULL,
  `GiamGia` varchar(50) DEFAULT '0',
  `TongTienThuc` decimal(15,2) NOT NULL,
  `LoaiThanhToan` enum('50%','100%') DEFAULT '100%',
  `SoTienDaThanhToan` decimal(15,2) DEFAULT 0.00,
  `TrangThaiThanhToan` enum('Chưa thanh toán','Đã cọc','Đã thanh toán','Còn nợ') DEFAULT 'Chưa thanh toán',
  `GhiChu` text DEFAULT NULL,
  `NgayLap` datetime DEFAULT current_timestamp(),
  `TrangThai` enum('Hoạt động','Hết hạn','Hủy') DEFAULT 'Hoạt động'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_datsanthang`
--

INSERT INTO `tbl_datsanthang` (`MaDatSanThang`, `MaKH`, `MaNV`, `DanhSachSan`, `NgayBatDau`, `NgayKetThuc`, `DanhSachNgay`, `GioBatDau`, `GioKetThuc`, `TongGio`, `TongTien`, `GiamGia`, `TongTienThuc`, `LoaiThanhToan`, `SoTienDaThanhToan`, `TrangThaiThanhToan`, `GhiChu`, `NgayLap`, `TrangThai`) VALUES
('DST1761030877946', 'KH731893', 'NV001', 'S8', '2025-11-04', '2025-11-25', '[\"2025-10-21\",\"2025-11-04\",\"2025-11-11\",\"2025-11-18\",\"2025-11-25\"]', '15:00:00', '18:00:00', 3, 1680000.00, '10%', 1512000.00, '100%', 1512000.00, 'Đã thanh toán', 'nguyen van thanh', '2025-10-21 14:14:37', 'Hoạt động'),
('DST1761030915768', 'KH002', 'NV001', 'S1', '2025-11-06', '2025-11-27', '[\"2025-11-06\",\"2025-11-13\",\"2025-11-20\",\"2025-11-27\"]', '05:00:00', '09:00:00', 4, 1600000.00, '10%', 1440000.00, '100%', 1440000.00, 'Đã thanh toán', 'Trần Thị B', '2025-10-21 14:15:15', 'Hoạt động'),
('DST1761108143152', 'KH015', 'NV001', 'S7', '2025-10-22', '2025-10-22', '[\"2025-10-22\"]', '07:00:00', '10:00:00', 3, 300000.00, '10%', 270000.00, '100%', 270000.00, 'Đã thanh toán', 'Nguyễn Thị O', '2025-10-22 11:42:23', 'Hoạt động'),
('DST1761108219088', 'KH015', 'NV001', 'S7', '2025-10-20', '2025-10-20', '[\"2025-10-20\"]', '07:00:00', '10:00:00', 3, 300000.00, '10%', 270000.00, '100%', 270000.00, 'Đã thanh toán', 'Nguyễn Thị O', '2025-10-22 11:43:39', 'Hoạt động');

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
('KH445585', 'an thuyên', NULL, '0988798999', ''),
('KH559576', 'an thuyên', NULL, '0988798999', ''),
('KH573815', 'a', NULL, '0909090909', ''),
('KH600675', 'an lão', NULL, '0321654987', ''),
('KH614639', 'an bình', NULL, '0654321987', ''),
('KH697865', 'abc', '', '0354553546', ''),
('KH700714', 'nguyen van thanh tung', '', '0976313548', ''),
('KH709126', 'an thuyên', NULL, '0988798999', ''),
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
-- Chỉ mục cho bảng `tbl_datsanthang`
--
ALTER TABLE `tbl_datsanthang`
  ADD PRIMARY KEY (`MaDatSanThang`),
  ADD KEY `MaKH` (`MaKH`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tbl_datsan`
--
ALTER TABLE `tbl_datsan`
  MODIFY `MaDatSan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

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
-- Các ràng buộc cho bảng `tbl_datsanthang`
--
ALTER TABLE `tbl_datsanthang`
  ADD CONSTRAINT `tbl_datsanthang_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `tbl_khachhang` (`id`);

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
