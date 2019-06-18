"""
Movie recommender.

Copyright (C) Martin Kondor 2019
See the LICENSE file for more information.

Example usage:
$ python rmovie.py "Toy Story (1995)"
$ python rmovie.py "John Wick (2014)"
"""
import argparse

import numpy as np
import pandas as pd


if __name__ != '__main__':
    m = '"rmovie.py" can\'t be imported'
    raise Exception(m)


arg_parser = argparse.ArgumentParser()
arg_parser.add_argument('movie_name', help='the title of the movie you like, from the list "data/movies.csv"')
args = arg_parser.parse_args()
del arg_parser

# Loading the needed data
df = pd.read_csv('data/movies.csv').merge(pd.read_csv('data/ratings.csv'), on='movieId')

# Check for the movie name in the database
movie_in_db = df['title'] == args.movie_name
if not np.any(movie_in_db):
    m = 'movie with title "{}", can\'t be found in the "data/movies.csv" file'
    raise Exception(m.format(args.movie_name))


recommended_movies = []

# Find the movie in the database, and sort it by rating
movie_db = df[movie_in_db].sort_values(by='rating', ascending=False)

# Get the first 5 users who liked this movie
for user in movie_db.iloc[:5]['userId'].values:

    # Get the rated movies for this user
    rated_movies = df[df['userId'] == user]

    # Get the five biggest rated movie by this user
    rated_movies = rated_movies[rated_movies['title'] != args.movie_name]\
                    .sort_values(by='rating', ascending=False)\
                    .iloc[:5]

    # Add these to the recommendations
    recommended_movies.extend(list(rated_movies['title'].values))


recommended_movies = np.unique(recommended_movies)

# Weighting each movie
given_movie_genres = df[movie_in_db].iloc[0]['genres'].split('|')  # Genres of the given movie
scores = {}  # {title: score ...}

for movie in recommended_movies:
    movie_d = df[df['title'] == movie].iloc[0]
    movie_genres = movie_d['genres'].split('|')
    score = 0

    # Scoring on how many given_movie_genres can be found in movie_genres
    for given_movie_genre in given_movie_genres:
        if given_movie_genre in movie_genres:
            score += 1

    scores[movie] = score

# Sort them on score and reverse it, because the bigger the score the better
recommended_movies = sorted(scores, key=lambda x: scores[x])[::-1]

for movie in recommended_movies:
    print(movie)
