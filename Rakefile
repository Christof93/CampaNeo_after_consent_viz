# frozen_string_literal: true

task :install do
  Dir.chdir('campaign_network_d3') do
    sh 'npm', 'install'
  end
end

task dev: :install do
  Dir.chdir('campaign_network_d3') do
    sh 'npm', 'run', 'dev'
  end
end

task dev_docker: :install do
  sh 'docker-compose', '-f', 'docker-compose.dev.yml', 'up'
end

task :docker do
  sh 'docker-compose', 'up', '--build'
end

task :tex do
  sh 'latexmk', '-cd'
end

namespace :tex do
  task :clean do
    sh 'latexmk', '-cd', '-C'
  end
end

task :default => :dev
