output "frontend_public_ip" {
  value = aws_instance.front.public_ip
}

output "backend_private_ip" {
  value = aws_instance.back.private_ip
}

output "db_private_ip" {
  value = aws_instance.db.private_ip
}