"""
Movie recommender.

Copyright (C) Martin Kondor 2019
See the LICENSE file for more information.

Example usage:
$ python rmovie.py "lord of the rings"
$ python rmovie.py "shawshank redemption"
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
    # m = 'movie with title "{}", can\'t be found in the "data/movies.csv" file'
    # raise Exception(m.format(args.movie_name))
    similar_names_with_points = []
    added_titles = []
    movie_name_words = [w.strip() for w in args.movie_name.lower().split(' ')]

    # Exclude "the"
    if 'the' in movie_in_db:
        del movie_in_db[movie_in_db.index('the')]

    # Find the most similars by name
    for title in df['title'].values:
        points = 0

        for word in title.lower().split(' '):
            if word in movie_name_words:
                points += 1

        # Do not add movie to the list if it has already been added
        if title not in added_titles:
            similar_names_with_points.append((title, points,))
            added_titles.append(title)


    # Choose the biggest pointed five
    del added_titles, movie_name_words
    similar_names_with_points = sorted(similar_names_with_points, key=lambda x: x[1], reverse=True)[:5]

    # Ask user for input
    print()
    print('Movie with title "{}", can\'t be found in the "data/movies.csv" file.'.format(args.movie_name))
    print('These are the most similar movie titles:')
    print()
    print('-' * 30)
    print('Index\tMovie title')

    for i, title in enumerate(similar_names_with_points):
        print('[' + str(i + 1) + ']:\t' + title[0]) 
    
    print('-' * 30)
    print()
    print('Please choose one by providing the index for the movie that is most likely what you search for. (Type 0 and enter for exit)')
    movie_index = input('Movie index: ')

    try:
        movie_index = int(movie_index)
    except ValueError:
        print('Wrong index, process terminated.')
        exit(1)

    if movie_index == 0:
        exit()
    else:
        movie_in_db = df['title'] == similar_names_with_points[movie_index - 1][0]


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

print()
print('-' * 30)
print('Movie recommendations:')
print()

for i, movie in enumerate(recommended_movies):
    print('[' + str(i + 1) + ']:\t' + movie)

print('-' * 30)
