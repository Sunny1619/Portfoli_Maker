import time
import sys
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError
from django.conf import settings


class Command(BaseCommand):
    help = 'Wait for database to be available'

    def add_arguments(self, parser):
        parser.add_argument(
            '--timeout',
            type=int,
            default=30,
            help='Timeout in seconds for waiting for the database'
        )

    def handle(self, *args, **options):
        timeout = options['timeout']
        self.stdout.write('Waiting for database...')
        
        db_conn = connections['default']
        start_time = time.time()
        
        while True:
            try:
                # Try to connect to the database
                db_conn.cursor()
                self.stdout.write(
                    self.style.SUCCESS('Database available!')
                )
                return
            except OperationalError as e:
                self.stdout.write(
                    f'Database unavailable: {e}'
                )
                
                if time.time() - start_time >= timeout:
                    self.stdout.write(
                        self.style.ERROR(
                            f'Database unavailable after {timeout} seconds!'
                        )
                    )
                    sys.exit(1)
                
                self.stdout.write('Waiting 1 second...')
                time.sleep(1)
