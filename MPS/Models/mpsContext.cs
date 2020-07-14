using System;
using System.Configuration;
using Google.Protobuf.WellKnownTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MPS.Models
{
    public partial class mpsContext : DbContext
    {
        public mpsContext()
        {
        }

        public mpsContext(DbContextOptions<mpsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admin { get; set; }
        public virtual DbSet<Car> Car { get; set; }
        public virtual DbSet<Driver> Driver { get; set; }
        public virtual DbSet<DriverCar> DriverCar { get; set; }
        public virtual DbSet<Schemaversions> Schemaversions { get; set; }
        public virtual DbSet<Store> Store { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySQL("Name=MpsDbConnection");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.LoginId)
                    .HasName("PRIMARY");

                entity.ToTable("admins");

                entity.Property(e => e.LoginId)
                    .HasColumnName("LoginID")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Car>(entity =>
            {
                entity.HasKey(e => e.Registration)
                    .HasName("PRIMARY");

                entity.ToTable("cars");

                entity.Property(e => e.Registration)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.Colour)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Make)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Model)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Driver>(entity =>
            {
                entity.ToTable("drivers");

                entity.Property(e => e.DriverId)
                    .HasColumnName("DriverID")
                    .HasColumnType("int(6)");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.TelNo)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<DriverCar>(entity =>
            {
                entity.HasKey(e => new { e.DriverId, e.Registration })
                    .HasName("PRIMARY");

                entity.ToTable("driver_car");

                entity.HasIndex(e => e.Registration)
                    .HasName("Registration");

                entity.Property(e => e.DriverId)
                    .HasColumnName("DriverID")
                    .HasColumnType("int(6)");

                entity.Property(e => e.Registration)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.HasOne(d => d.Driver)
                    .WithMany(p => p.DriverCar)
                    .HasForeignKey(d => d.DriverId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("driver_car_ibfk_1");

                entity.HasOne(d => d.RegistrationNavigation)
                    .WithMany(p => p.DriverCar)
                    .HasForeignKey(d => d.Registration)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("driver_car_ibfk_2");
            });

            modelBuilder.Entity<Schemaversions>(entity =>
            {
                entity.HasKey(e => e.Schemaversionid)
                    .HasName("PRIMARY");

                entity.ToTable("schemaversions");

                entity.Property(e => e.Schemaversionid)
                    .HasColumnName("schemaversionid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Applied)
                    .HasColumnName("applied")
                    .HasDefaultValueSql("'current_timestamp()'")
                    .ValueGeneratedOnAddOrUpdate();

                entity.Property(e => e.Scriptname)
                    .IsRequired()
                    .HasColumnName("scriptname")
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Store>(entity =>
            {
                entity.ToTable("store");

                entity.HasIndex(e => e.Car_reg)
                    .HasName("Car_reg");

                entity.Property(e => e.PalletId)
                    .HasColumnName("PalletID")
                    .HasColumnType("smallint(3)");

                entity.Property(e => e.Car_reg)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .HasDefaultValueSql("'NULL'");

                entity.HasOne(d => d.RegistrationNavigation)
                    .WithMany(p => p.Store)
                    .HasForeignKey(d => d.Car_reg)
                    .HasConstraintName("store_ibfk_1");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
