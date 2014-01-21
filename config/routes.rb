Bejeweled::Application.routes.draw do
  root :to => "static_pages#root"
  resources :games
end
