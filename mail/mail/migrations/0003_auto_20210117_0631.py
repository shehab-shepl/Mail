# Generated by Django 3.1.5 on 2021-01-17 04:31

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mail', '0002_auto_20210117_0628'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='timestamp',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2021, 1, 17, 6, 31, 4, 161188)),
        ),
    ]