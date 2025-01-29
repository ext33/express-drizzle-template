printf "\e[34mWaiting while database loading...\n\e[0m"
sleep 10

printf "\e[34mStarting service...\n\e[0m"

npm run db-makemigrations
npm run db-migrate
npm run dev
