sudo apt-get update
sudo apt-get -y install nginx

sudo apt-get -y install redis

curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo cp -r node_proxy.conf /etc/nginx/sites-available/default
##sudo ln -s /etc/nginx/sites-available/laravel.conf /etc/nginx/sites-enabled/

sudo apt-get -y install certbot python3-certbot-nginx
sudo certbot --nginx --agree-tos --register-unsafely-without-email --redirect --domain login.ctbuh.org
