-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql_container:3306
-- Generation Time: Oct 23, 2020 at 02:40 PM
-- Server version: 8.0.21
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zwallet`
--

-- --------------------------------------------------------

--
-- Table structure for table `topup`
--

CREATE TABLE `topup` (
  `id` int NOT NULL,
  `detail` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topup`
--

INSERT INTO `topup` (`id`, `detail`, `created_at`, `updated_at`) VALUES
(1, '213', '2020-10-07 14:06:19', '2020-10-07 14:06:19'),
(2, 'Type the virtual account number that we provide you at the top.', '2020-10-08 00:02:11', '2020-10-08 00:02:11'),
(3, 'Type the virtual account number that we provide you at the top.', '2020-10-08 00:02:11', '2020-10-08 00:02:11'),
(4, 'Type the virtual account number that we provide you at the top.', '2020-10-08 00:02:12', '2020-10-08 00:02:12'),
(5, 'Type the virtual account number that we provide you at the top.', '2020-10-08 00:02:13', '2020-10-08 00:02:13'),
(6, 'Type the virtual account number that we provide you at the top.', '2020-10-08 00:02:14', '2020-10-08 00:02:14');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `id_from_user` int NOT NULL,
  `id_to_user` int NOT NULL,
  `note` varchar(100) NOT NULL,
  `total` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `id_from_user`, `id_to_user`, `note`, `total`, `created_at`, `updated_at`) VALUES
(1, 3, 2, 'ea', '10000000', '2020-10-07 20:52:32', '2020-10-07 20:52:32'),
(2, 2, 3, '11', '10000', '2020-10-07 23:25:05', '2020-10-07 23:25:05'),
(3, 2, 3, '1', '1000000', '2020-10-07 23:37:29', '2020-10-07 23:37:29'),
(4, 2, 3, '100', '1000', '2020-10-07 23:51:57', '2020-10-07 23:51:57'),
(5, 2, 3, '100', '10000', '2020-10-07 23:52:42', '2020-10-07 23:52:42'),
(6, 2, 3, '100', '10000', '2020-10-07 23:53:56', '2020-10-07 23:53:56'),
(7, 2, 3, '10', '100', '2020-10-07 23:55:03', '2020-10-07 23:55:03'),
(8, 2, 3, 'Ini untuk api', '10000', '2020-10-08 00:01:13', '2020-10-08 00:01:13'),
(9, 3, 2, '123', '1000000', '2020-10-19 01:06:04', '2020-10-19 01:06:04'),
(10, 2, 3, '123213', '1008900', '2020-10-21 21:46:48', '2020-10-21 21:46:48'),
(11, 2, 3, '123', '100', '2020-10-21 21:58:55', '2020-10-21 21:58:55'),
(12, 2, 3, '123213', '1000', '2020-10-21 22:02:35', '2020-10-21 22:02:35'),
(13, 2, 3, '12', '1000', '2020-10-21 22:03:14', '2020-10-21 22:03:14'),
(14, 2, 3, '123', '10000', '2020-10-21 22:04:10', '2020-10-21 22:04:10'),
(15, 2, 4, 'Ini buat lo', '1000000', '2020-10-22 03:06:34', '2020-10-22 03:06:34'),
(16, 2, 12, '1', '1232132', '2020-10-23 13:36:20', '2020-10-23 13:36:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `balance` bigint NOT NULL DEFAULT '0',
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pin` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `balance`, `verified`, `photo`, `pin`, `role`, `created_at`, `updated_at`) VALUES
(2, 'Api Rahman', '213213321', 'apirahman55@gmail.com', '$2a$10$4bSZKRMmfbTcj2GtWT7En.PAlurtnwsPeFgyuT3tqYrSFNXp7JzLG', 6675768, 0, 'http://localhost:4000/images/photo-1603336048400-muhammad-haikal-sjukri-DZ0WPLmvK_c-unsplash.jpg', '123123', 'admin', '2020-10-07 17:14:50', '2020-10-07 17:14:50'),
(3, 'Api Al Rahman', '123123', 'apirahman51@gmail.com', '$2a$10$PLfQV95GSS7f2txKHqqcRO/WOTwSdvkjxGpJN87F2Q4c5e6Zi7MIq', 1092100, 0, NULL, '123123', 'user', '2020-10-07 20:52:10', '2020-10-07 20:52:10'),
(4, 'riksi', NULL, 'riksi@gmail.com', '$2a$10$6hJcVOZxohUlrQqnUlyl5OcxWcTI5m0kYWHKIqFQCs9ycHD7a8ne2', 1000000, 0, NULL, NULL, 'user', '2020-10-15 03:34:43', '2020-10-15 03:34:43'),
(5, 'Apipa', NULL, 'api@gmail.com', '$2a$10$jRMNi3w8ydJCluyGQEz6w.3UdUwtIIAj96scY9Zm7BgRC65C8aGZu', 0, 0, NULL, NULL, 'user', '2020-10-21 23:43:55', '2020-10-21 23:43:55'),
(6, 'Apa', NULL, 'apaa@gmail.com', '$2a$10$DhSI8JLrDDpZJ7jM8vxw8OUUCvF.U1NK6cOS5k/7Wi.3to7EnNT8y', 0, 0, NULL, NULL, 'user', '2020-10-21 23:45:59', '2020-10-21 23:45:59'),
(7, 'apa', NULL, 'apa@gmail.com', '$2a$10$y4Nr97Yq6G5Z9W67R22EFeQzAvX570MbDmQd3xEo/zcl4sMS0kWD.', 0, 0, NULL, NULL, 'user', '2020-10-21 23:48:18', '2020-10-21 23:48:18'),
(8, 'Api Rahman', NULL, 'api2@gmail.com', '$2a$10$1I2m/pSayfsWCXjf4.Ueh.OrxHo6LFEJghnNZMXFHkmupgtxorsni', 0, 0, NULL, NULL, 'user', '2020-10-22 00:54:26', '2020-10-22 00:54:26'),
(9, 'tes', NULL, 'tes@gmail.com', '$2a$10$xh/J8yQlPk47KAYPmEAsBu3qIItxc09gDugHIDC33AmyVFllCpOEG', 0, 0, NULL, NULL, 'user', '2020-10-22 00:55:12', '2020-10-22 00:55:12'),
(10, 'apirahman', '123213', 'apirahman52@gmail.com', '$2a$10$KmT79FGSn5mSBKrVjaYnpuyAa/DWrQweLVFuPBIlqBocB0PG35Lye', 0, 0, NULL, '123123', 'user', '2020-10-22 01:01:11', '2020-10-22 01:01:11'),
(11, 'apirahman ntaps', NULL, 'apirahman500@gmail.com', '$2a$10$MCA6vEWOq0RRuzFYli2PYezSMJ2nllwV8w7iYwFZ1Xxy/g2WQv5y2', 0, 0, NULL, '123123', 'user', '2020-10-22 03:04:01', '2020-10-22 03:04:01'),
(12, '123213', NULL, '123213@gmail.com', '$2a$10$gz8bCGvzDQtkwNG0AqyU/OuTPZpCzuv1BSVnmiisZogULK1RSofpy', 1232132, 0, NULL, '123123', 'user', '2020-10-22 03:14:32', '2020-10-22 03:14:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `topup`
--
ALTER TABLE `topup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `frgn_id_from_user` (`id_from_user`),
  ADD KEY `frgn_id_to_user` (`id_to_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `topup`
--
ALTER TABLE `topup`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `frgn_id_from_user` FOREIGN KEY (`id_from_user`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `frgn_id_to_user` FOREIGN KEY (`id_to_user`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
