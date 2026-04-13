data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

############################
# EC2 FRONT
############################

resource "aws_instance" "front" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id
  key_name      = var.key_name

  vpc_security_group_ids = [
    aws_security_group.front.id
  ]

  user_data = <<-EOF
                #!/bin/bash
                dnf update -y

                # docker
                dnf install -y docker
                systemctl enable docker
                systemctl start docker

                # nginx
                dnf install -y nginx
                systemctl enable nginx
                systemctl start nginx

                # esperar nginx
                sleep 5

                # html
                cat > /usr/share/nginx/html/index.html <<HTML
                <html>
                <head>
                <title>Frontend</title>
                </head>
                <body>
                <h1>Frontend funcionando correctamente</h1>
                </body>
                </html>
                HTML

                # reiniciar nginx
                systemctl restart nginx

                EOF

  tags = {
    Name = "ec2-front"
  }
}

############################
# EC2 BACK
############################

resource "aws_instance" "back" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.private.id
  key_name      = var.key_name

  vpc_security_group_ids = [
    aws_security_group.back.id
  ]

  user_data = <<-EOF
              #!/bin/bash
              dnf update -y

              # docker
              dnf install -y docker
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ec2-user

              # java 21
              dnf install -y java-21-amazon-corretto

              # utilidades
              dnf install -y git

              mkdir /app
              chown ec2-user:ec2-user /app
              EOF

  tags = {
    Name = "ec2-back"
  }
}

############################
# EC2 DB
############################

resource "aws_instance" "db" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.private.id
  key_name      = var.key_name

  vpc_security_group_ids = [
    aws_security_group.db.id
  ]

  user_data = <<-EOF
              #!/bin/bash
              dnf update -y

              # instalar postgres
              dnf install -y postgresql15-server postgresql15

              # init db
              postgresql-setup --initdb

              systemctl enable postgresql
              systemctl start postgresql

              # crear usuario y db
              sudo -u postgres psql -c "CREATE DATABASE gimnasio;"
              sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD 'admin';"
              sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gimnasio TO admin;"

              # permitir conexiones remotas
              sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /var/lib/pgsql/data/postgresql.conf

              echo "host all all 0.0.0.0/0 md5" >> /var/lib/pgsql/data/pg_hba.conf

              systemctl restart postgresql
              EOF

  tags = {
    Name = "ec2-db"
  }
}