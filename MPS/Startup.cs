using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DbUp;
using System.Reflection;
using MySql.Data.MySqlClient;
using System;
using Dapper;
using System.Linq;
using MPS.Models;
using Microsoft.EntityFrameworkCore;
using MPS.Data.Repository;
using MPS.Hubs;
//using MPS.Data.Services;

namespace MPS_Main
{
    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddSignalR();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            var connectionString = Configuration.GetConnectionString("MpsDbConnection");


            // Configuring DbUp to do migrations - Pg365 
            //EnsureDatabase.For.MySqlDatabase(connectionString);

            var upgrader = DeployChanges.To
                .MySqlDatabase(connectionString, null)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                .WithTransactionPerScript()
                .WithVariablesDisabled()
                .LogToConsole()
                .Build();

            //Check whether there are any pending SQL Scripts
            if (upgrader.IsUpgradeRequired())
            {
                upgrader.PerformUpgrade(); // do the actual migration
            }

            services.AddControllers();

            services.AddScoped<IDataRepository, DataRepository>();

            services.AddCors(options =>
                options.AddPolicy("CorsPolicy", builder =>
                builder.AllowAnyMethod()
                .AllowAnyHeader()
                .WithOrigins("http://localhost:5001")
                .AllowCredentials()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("CorsPolicy");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<StoreHub>("/storeHub");
            });


            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
