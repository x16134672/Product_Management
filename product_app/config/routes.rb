Rails.application.routes.draw do
  resources :products, only: [:index, :show, :create, :update, :destroy]  # Sets up CRUD routes for products
end

Rails.application.routes.draw do
  resources :products
  namespace :test do
    post 'reset_database', to: 'databases#reset_database'
  end
end