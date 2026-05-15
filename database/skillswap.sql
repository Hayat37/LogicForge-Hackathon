-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2026 at 04:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skillswap`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `requester_id` int(11) DEFAULT NULL,
  `skill_id` int(11) DEFAULT NULL,
  `status` enum('pending','accepted','declined') DEFAULT 'pending',
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `requester_id`, `skill_id`, `status`, `message`, `created_at`) VALUES
(1, 6, 1, 'declined', 'I would like to learn this skill!', '2026-05-15 08:22:27'),
(2, 6, 1, 'declined', 'I would like to learn this skill!', '2026-05-15 08:37:50'),
(3, 6, 1, 'declined', 'I would like to learn this skill!', '2026-05-15 08:38:03'),
(4, 6, 1, 'accepted', 'I would like to learn this skill!', '2026-05-15 08:38:04'),
(5, 6, 1, 'accepted', 'I would like to learn this skill!', '2026-05-15 08:38:04'),
(6, 8, 2, 'pending', 'I would like to learn this skill!', '2026-05-15 08:42:55'),
(7, 8, 2, 'pending', 'I would like to learn this skill!', '2026-05-15 08:51:51'),
(8, 8, 2, 'pending', 'I would like to learn this skill!', '2026-05-15 08:54:58'),
(9, 8, 4, 'declined', 'I would like to learn this skill!', '2026-05-15 11:54:40'),
(10, 8, 5, 'declined', 'I would like to learn this skill!', '2026-05-15 11:59:59'),
(11, 8, 6, 'declined', 'I would like to learn this skill!', '2026-05-15 12:33:55'),
(12, 11, 6, 'accepted', 'I would like to learn this skill!', '2026-05-15 12:53:18');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `type` enum('offer','need') DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `user_id`, `title`, `type`, `description`, `created_at`) VALUES
(1, 8, 'React Native', 'offer', '', '2026-05-15 08:21:25'),
(2, 6, 'math', 'offer', '', '2026-05-15 08:37:57'),
(3, 8, 'Biology', 'need', '', '2026-05-15 11:20:09'),
(4, 10, 'math', 'offer', 'i know math', '2026-05-15 11:54:10'),
(5, 10, 'biology', 'offer', 'none', '2026-05-15 11:59:43'),
(6, 10, 'Chemistry', 'offer', 'I can teach chemistry', '2026-05-15 12:33:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `bio`, `created_at`) VALUES
(6, 'Ephrata', 'eph@gmail.com', '$2y$10$/UBio3sCh2nw8LBX53K2KuN0dXt4TE8QyAoHTnqgrVKfqU1jeV9tm', NULL, '2026-05-14 10:47:42'),
(7, 'hi', 'hi@gmail', '$2y$10$TxARztaU.tW27r8CVFEOPeClLt3PCMrGLMRD0OjBz8b/eYSaXXyXa', NULL, '2026-05-14 14:32:28'),
(8, 'a b', 'a@gmail.com', '$2y$10$jG93u1W6q3GWC2h3toLxvO/DMv5MHO7VhvO23LiZl.aXKahj/FBty', NULL, '2026-05-15 08:07:07'),
(9, 'heeh', 'ab@gmail.com', '$2y$10$FO15n6QNqPkZKgT6kcWtwufQ3iFy6Vzodl/H.MknAmNAIdiGmcnNS', '', '2026-05-15 11:53:03'),
(10, 'hh', 'ac@gmail.com', '$2y$10$udBhsQCAqXUTG1EdVnDtPuFMMeqAl7nO0aOxXV/AEiVjhEZlgKds.', 'hello', '2026-05-15 11:53:44'),
(11, 'ggg', 'ag@gmail.com', '$2y$10$JH94ROGGlD15M/.9Pb/7PesZMXBJB2rcU3Y4RwjhesoUx70w9yrJm', '', '2026-05-15 12:52:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requester_id` (`requester_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);

--
-- Constraints for table `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
